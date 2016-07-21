FROM node:5-onbuild
MAINTAINER Ryan Baumann <ryan.baumann@gmail.com>

# Install neo4j here, for neo4j-shell
RUN wget -O - https://debian.neo4j.org/neotechnology.gpg.key | apt-key add -
RUN echo 'deb http://debian.neo4j.org/repo stable/' >/tmp/neo4j.list
RUN mv -v /tmp/neo4j.list /etc/apt/sources.list.d
RUN apt-get update && apt-get install -y neo4j=2.3.5

VOLUME [ "/usr/src/app" ]

EXPOSE 3001
CMD [ "node", "quickstart.js" ]
