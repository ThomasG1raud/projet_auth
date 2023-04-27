# S4 R4.01 : Web services - JWT Authorization Project

This project is an implementation of an authentication microservice with JSON Web Tokens and Social Sign-In (Google, Facebook, Twitter, Github, and Apple). The aim of this project is to demonstrate how to implement authentication and authorization in a microservices architecture.

## Technologies Used

This project uses the following technologies:

- Express.js for creating the microservice
- JSON Web Tokens for authentication
- Passport.js for social sign-in authentication
- Sequelize ORM for interacting with the database
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
DB_HOST=localhost
DB_USERNAME=yourusername
DB_PASSWORD=yourdbpassword
DB_DATABASE=yourdbname
DB_PORT=3306

# Google OAuth credentials
CLIENT_ID = Add your own CLIENT_ID, you can get one on google cloud in API and services
CLIENT_SECRET = Same thing for CLIENT_SECRET

# Discord OAuth credentials

DISCORD_CLIENT_ID = Add your own DISCORD_CLIENT_ID, you can get one on Discord application 
DISCORD_CLIENT_SECRET = Same thing for DISCORD_CLIENT_SECRET
```
## You can follow the tutorial to get your credentials in the part "2.1.3 Tutoriel pour vous procurez les credentials pour Google et Discord
" of our project report.

4. Passeport v.0.6.0 seems to be currently broken due to an incompatibility, use the latest v0.5.0 instead:

```bash
npm uninstall passport
npm install passport@0.5
```

5. Next, launch MongoDB and establish a connection to the "images" database using the following address: mongodb://localhost:27017/images.

6. You can now launch the app:
```bash
node server.js
```

7. Open a browser and navigate to **'http://localhost:3000/'** to view the application.

That's it!

## Sources

- [Authorization & Authentification](https://github.com/cornflourblue/node-role-based-authorization-api) by [cornflourblue](https://github.com/cornflourblue)

## Authors

- [Thomas Giraud](https://github.com/ThomasG1raud)
- [Antoine Lachat](https://github.com/ant0ineLACHAT)
- [Taha Moumen](https://github.com/TahaMoumen)
- [Aurélien Guillou](https://github.com/aurelienGUILLOU)
- [Thomas Chu](https://github.com/GitGudShu)
