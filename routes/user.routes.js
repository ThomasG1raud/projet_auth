const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/test/all", controller.allAccess);
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
    app.get(
        "/test/user",
        [authJwt.verifyToken],
        controller.userAccess
    );
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
};
