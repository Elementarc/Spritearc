FROM ubuntu:18.04
WORKDIR /home
RUN apt update -y
RUN apt install git curl npm vim -y
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install nodejs -y
