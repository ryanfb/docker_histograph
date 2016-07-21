var Q = require('kew')
var R = require('ramda')
var path = require('path')
var proc = require('child_process')
var u = require('util')
var http = require('http')

// speak
function log(what, cwd, cmd) {
  var c = cwd ? u.format('[%s] ', cwd) : '';
  console.log(u.format('%s %s=> %s', what, c, (cmd || []).join(' ')))
}

// relative dir
function relative(x) {
  return path.join(__dirname, x)
}

// turn 'lala %s' into function
var template = R.curry(function(s, x){
  return u.format(s, x).split(' ');
})

// execute command in cwd
// command is array ['echo', 'foo', 'bar']
// cwd may be false
function exec(cmd, cwd) {
  var d = Q.defer()
  log('RUNNING', cwd, cmd);
  var opts = (cwd && {cwd: relative(cwd)}) || {}
  proc.execFile(R.head(cmd), R.tail(cmd), opts, function(err,stdout,stderr){
    if(stdout) console.log(stdout.trim())
    if(stderr) console.log(stderr.trim())
    if(err) d.reject(err)
    else d.resolve(stdout.trim())
  })
  return d.promise;
}

// run command as subprocess
// command is array ['echo', 'foo', 'bar']
// cwd may be false
function spawn(cmd, cwd) {
  log('DAEMON', cwd, cmd);
  var opts = { stdio: ['ignore','inherit','inherit'] }
  if(cwd) opts.cwd = relative(cwd)
  proc.spawn(R.head(cmd), R.tail(cmd), opts)
}

// returns function when applied to x exec's the template with x substituted
function runTemplate(s, cwd) {
  return R.compose(
    R.flip(R.curry(exec))(cwd),
    template(s)
  )
}

// returns function when applied to x runs command in that dir x
function runDir(s) {
  return R.curry(exec)(s.split(' '))
}


// API host
process.env.HISTOGRAPH_CONFIG = path.join(__dirname, 'config.yaml')
var conf = require('histograph-config');

// promise that rejects when API is done
function isUp() {
  var d = Q.defer()
  var r = http.request(conf.api.baseUrl, function(res) {
    if(res.statusCode === 200) d.resolve(true)
    else d.reject(res.statusCode)
  })
  r.on('error', d.reject.bind(d))
  r.end()
  return d.promise;
}

// spin failing promise
function retryPromise(n, mkPromise) {
	if(n > 0)
	return mkPromise()
		.fail(function(){
			return retryPromise(n - 1, mkPromise);
		});

	return mkPromise();
}

function up_check()
{
   // 10 tries, with 1 second delay
   return retryPromise(10, function() {
     process.stdout.write('.');
     return Q.delay(1000).then(isUp)
   })
}

// collection of commands
var $ = {
  projects: 'api core import data'.split(' '),
  rimraf: runTemplate('rm -rf %s', false),
  gitClone: runTemplate('git clone https://github.com/histograph/%s', false),
  npmInstall: runDir('npm i'),
  nodeRun: runDir('node index.js geonames tgn'),
  daemon: R.curry(spawn)('node index.js geonames tgn'.split(' ')),
}


// install script
console.log('cleaning')
Q.all(R.map($.rimraf, $.projects))
.then(function(){
  log('git clone')
  return Q.all(R.map($.gitClone, $.projects))
})
.then(function(){
  log('npm install')
  return Q.all(R.map($.npmInstall, $.projects))
})
.then(function(){
  log('download and convert data')
  return $.nodeRun('data')
})
.then(function(){
  log('clear neo4j edges')
  return exec(['neo4j-shell',
    '-host',conf.neo4j.host,
    '-port','1337',
    '-c',
    'match ()-[e]-() delete e;'], false)
})
.then(function(){
  log('clear neo4j nodes')
  return exec(['neo4j-shell',
    '-host',conf.neo4j.host,
    '-port','1337',
    '-c',
    'match (n) delete n;'], false)
})
.then(function(){
  log('create neo4j schema')
  return exec(['neo4j-shell',
    '-host',conf.neo4j.host,
    '-port','1337',
    '-c',
    'create constraint on (n:_) assert n.id is unique;'], false)
})
.then(function(){
  log('starting api, core')
  R.map($.daemon, ['api','core'])
  return up_check()
})
.then(function(){
  log('importing data')
  return $.nodeRun('import')
})
.fail(function(err){
  console.error(err && err.stack || err)
})

