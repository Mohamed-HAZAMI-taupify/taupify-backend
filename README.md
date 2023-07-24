# everest-project
Description du projet !
# everest-project

# MERN Dockerized Application

This is a Dockerized MERN (MongoDB, Express, React, Node.js) application template. It provides a development environment using Docker Compose to easily set up and run the application stack.

## Prerequisites

Make sure you have the following installed:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone the repository:

git clone <repository-url>
cd <repository-directory>


2. Set up the environment variables:

Create a .env file in the root directory of the project.
Add the necessary environment variables to the .env file. You can use the .env.example file as a reference.

3. Build and run the application using Docker Compose:

sudo docker-compose up

This command will build and start the containers for the server, client, nginx, and Redis.

4. Access the application:

The client application will be available at http://localhost:3000.
The server API will be available at http://localhost:4000.
Nginx will be running on http://localhost:3050.

Project Structure
 .  client/: Contains the React client application.
 .  server/: Contains the Node.js server application.
 .  nginx/: Contains the Nginx configuration files.

Available Scripts
In the project directory, you can run the following scripts:

Server
npm run dev: Starts the server application in development mode with nodemon.

Client
npm start: Starts the client application in development mode.
npm run build: Builds the client application for production.

Nginx
The Nginx configuration files can be found in the nginx/ directory.