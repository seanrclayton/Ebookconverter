FROM linuxserver/calibre
RUN apt-get update
RUN apt-get install npm -y 
COPY . /app
WORKDIR /app
CMD [ "node", "app.js" ]
