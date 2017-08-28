#image to base this image on
#This image comes with Node.js and NPM already installed
FROM node:boron

# Next we create a directory to hold the application code inside the image, this will be the working directory for the application:
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

#To bundle the app's source code inside the Docker image, use the COPY instruction:
COPY . /usr/src/app

#The app binds to port 80 so you'll use the EXPOSE instruction to have it mapped by the docker daemon:
EXPOSE 80

#define the command to run your app using CMD which defines your runtime. Here we will use the basic npm start which will run node server.js to start your server:

CMD [ "npm", "start" ]
