# docker_histograph

This is a Dockerized environment for running a development instance of [histograph](http://histograph.io/), based on [histograph/quickstart](https://github.com/histograph/quickstart).

Requirements:

 * [`docker`](https://www.docker.com/)
 * [`docker-compose`](https://docs.docker.com/compose/)

Usage:

 * Find your `docker` IP address with e.g. `docker-machine ip dev`
 * Run `docker-compose build && docker-compose up`
 * Open `docker.machine.ip.from-earlier:3001` in a browser
