const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const app = express();
let corsOptions = {
    origin: "http: /localhost:3000"
};
app.use(cors(corsOptions));
// analyser les requêtes de type de contenu - application/json
app.use(bodyParser.json());
// analyser les requêtes de type de contenu - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/** Swagger Initialization - START */
const swaggerSpec = swaggerJsdoc({
    swaggerDefinition: {
        openapi: "3.0.2",
        info: {
            title: "TP EXPRESS JWT",
            version: "1.0.0",
            description:
                "API documentation",
            servers: [`http://localhost:${process.env.PORT || 3000}/`],
        },
        components: {
            securitySchemes: {
                jwt: {
                    type: "http",
                    scheme: "bearer",
                    in: "header",
                    bearerFormat: "JWT"
                },
            }
        }
        ,
        security: [{
            jwt: []
        }],
    },
    apis: ["server.js", "./routes/*.js"],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/** Swagger Initialization - END */








/**
 * @swagger
 * /auth/signup:
 *   post:
 *      description: Used to signup user
 *      tags:
 *          - users
 *      requestBody:
 *          required: true
 *          content:
 *             application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        firstName:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 50
 *                          example: firstname
 *                        lastName:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 50
 *                          example: lastname
 *                        emailId:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 50
 *                          example: test@something.com
 *                        password:
 *                          type: string
 *                          minLength: 4
 *                          maxLength: 50
 *                          example: abcd
 *      security:
 *	       - jwt: []
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */


/**
 * @swagger
 * /auth/signin:
 *   post:
 *      description: Used to sign in user
 *      tags:
 *          - users
 *      requestBody:
 *          required: true
 *          content:
 *             application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        emailId:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 50
 *                          example: test@something.com
 *                        password:
 *                          type: string
 *                          minLength: 4
 *                          maxLength: 50
 *                          example: abcd
 *      security:
 *	       - jwt: []
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */



/**
 * @swagger
 * /test/all:
 *   get:
 *      security:
 *	       - jwt: []
 *      description: Used to access public content
 *      tags:
 *          - users
 *      responses:
 *          '200':
 *              description: Resource returned successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */


/**
 * @swagger
 * /test/user:
 *   get:
 *      security:
 *	       - jwt: []
 *      description: Used to access user content
 *      tags:
 *          - users
 *      responses:
 *          '200':
 *              description: Resource returned successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */


/**
 * @swagger
 * /auth/refreshtoken:
 *   post:
 *      description: Used to refresh token
 *      tags:
 *          - users
 *      requestBody:
 *          required: true
 *          content:
 *             application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        refreshToken:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 100
 *      security:
 *	       - jwt: []
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

app.get("/", (req, res) => {
    res.json({ message: "Bienvenue dans l'application : Auth JWT" });
});

const db = require("./models");
db.sequelize.sync().then(() => {
    console.log('Database synchronized successfully');
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// définir le port, écouter les requêtes
const PORT = process.env.PORT | 3000;
app.listen(PORT, () => {
    console.log(`Serveur écoute sur le port ${PORT}.`);
});