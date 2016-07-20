# Histograph quickstart

Clone this repository

	git clone https://github.com/histograph/quickstart histograph

Make sure you have Node JS and NPM installed.
Make sure you have Redis, Elastic and Neo4J running at default ports.
If not localhost, default port, change `config.yaml`.
Disable Neo4J auth, install Elastic default mapping. Clear Elastic search. 

Ready? Ok, run:

	cd histograph
	npm start

Then grab a movie or something, sit back and relax, this will

1. install quickstart dependencies
1. start quickstart
1. rimraf api, data, import, core directories
1. clean Neo4J (**warning!!**) and install schema
1. clone histograph repositories
1. install node dependencies
1. generate some core datafiles
1. start core and API and wait until API is up
1. import all generated data

Takes half an hour or so...

Copyright (C) 2015 [Waag Society](http://waag.org).
