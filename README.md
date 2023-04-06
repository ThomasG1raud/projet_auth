# S4 R4.01 : Web services - JWT Authorization Project

This project is an implementation of an authentication microservice with JSON Web Tokens and Social Sign-In (Google, Facebook, Twitter, Github, and Apple). The aim of this project is to demonstrate how to implement authentication and authorization in a microservices architecture.

## Technologies Used

This project uses the following technologies:

- Express.js for creating the microservice
- JSON Web Tokens for authentication
- Passport.js for social sign-in authentication
  -Sequelize ORM for interacting with the database
- CORS middleware for handling cross-origin requests
- Swagger UI for API documentation
- Chai and Mocha for unit testing

## Installation

To run this project locally, follow these steps:

1. Clone the repository to your local machine:

```bash
git clone https://github.com/ThomasG1raud/projet_auth.git
```

2. Install the necessary dependencies. Open one terminal
   window and navigate to the root directory.

```bash
# Back-end dependencies
npm install
```

3. Create a `.env` in the root of the project with the following environment variables (you will need to adapt DB_USERNAME, DB_PASSWORD and DB_DATABASE based on a personnal database you use locally):

```bash
# Database configuration
db_host=localhost
db_username=yourusername
db_password=yourdbpassword
db_database=yourdbname
db_port=3306

# Google OAuth credentials
client_id= add your own client_id that you can get on google cloud in API and services
client_secret= Do the same than client_id
```

4. Passeport v.0.6.0 seems to be currently broken due to an incompatibility, use the latest v0.5.0 instead:

```bash
npm uninstall passport
npm install passport@0.5
```

5. You can now launch the app:

```bash
node server.js
```

6. Open a browser and navigate to **'http://localhost:3000/api-docs/'** to view the application.

That's it!

## Sources

- [Authorization & Authentification](https://github.com/cornflourblue/node-role-based-authorization-api) by [cornflourblue](https://github.com/cornflourblue)

## Authors

- [Thomas Giraud](https://github.com/ThomasG1raud)
- [Antoine Lachat](https://github.com/ant0ineLACHAT)
- [Taha Moumen](https://github.com/TahaMoumen)
- [Aurélien Guillou](https://github.com/aurelienGUILLOU)
- [Thomas Chu](https://github.com/GitGudShu)
