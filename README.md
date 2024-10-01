# Quiz App

## Overview

The **Quiz App** is a web application built using NestJS, designed to facilitate the creation and management of quizzes. This application uses **SQLite** for the database and **Sequelize** for ORM (Object-Relational Mapping). The application can be easily run in a local development environment using Docker and Docker Compose.

## Features

- Create quizzes.
- Manage quiz questions and answers.
- RESTful API for client-server communication.
- Built-in validation and error handling.
- Easy setup and deployment using Docker.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/) - Platform for developing, shipping, and running applications.
- [Docker Compose](https://docs.docker.com/compose/install/) - Tool for defining and running multi-container Docker applications.

## Getting Started

Follow the instructions below to set up and run the Quiz App locally.

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/quiz-app.git
```

```bash
cd nest-quiz-app
```

```bash
cp .env.example .env
```

**add the port in the .env file to run the application:**


```bash
docker-compose build
```


```bash
docker-compose up
```

**Given all the apis postman collection on the root Quiz App.postman_collection.json import in the postman and can use all the apis**

