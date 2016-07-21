FROM node:5
MAINTAINER Ryan Baumann <ryan.baumann@gmail.com>

RUN git clone https://github.com/histograph/viewer.git && cd viewer && git checkout 95c0c7c4396c04659689b8a8674af49034fad385

WORKDIR viewer
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
