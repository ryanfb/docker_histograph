# docker_histograph

This is a Dockerized environment for running a development instance of [histograph](http://histograph.io/), based on [histograph/quickstart](https://github.com/histograph/quickstart).

Requirements:

 * [`docker`](https://www.docker.com/)
 * [`docker-compose`](https://docs.docker.com/compose/)

Usage:

 * Find your `docker` IP address with e.g. `docker-machine ip dev`
 * Change the IP address for `api.baseUrl` in `histograph/config.yaml` to the IP address you just obtained
 * Run `docker-compose build && docker-compose up`
 * Open `docker.machine.ip.from-earlier:3000` in a browser
