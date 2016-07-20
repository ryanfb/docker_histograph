#!/bin/bash

apt-get update && apt-get install -y git maven openjdk-7-jdk openjdk-7-doc openjdk-7-jre-lib

git clone --branch v0.5.0 https://github.com/histograph/neo4j-plugin.git
cd neo4j-plugin
mvn package
cp -v target/histograph-plugin-0.5.0-SNAPSHOT.jar /usr/share/neo4j/plugins
ls /usr/share/neo4j/plugins
