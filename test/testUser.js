var expect = require("chai").expect;
var server = require("../server");
var request = require("request");
var authControl = require("../controllers/auth.controller");

describe("arriver sur la page d'accueil", function(){
    describe("message de bienvenue", function(){
        var url = "http://localhost:3000";
        it("retourne un message", function(done){
            request(url, function(error, response, body){
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.a("string");
                expect(response.body).to.equal("{\"message\":\"Bienvenue dans l'application : Auth JWT\"}");
                done();
            })
        })
    })
});

describe("recuperation contenu user", function(){
    describe("contenu pour tous", function(){
        var url = "http://localhost:3000/test/all";
        it("retourne contenu public", function(done){
            request(url, function(error, response, body){
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.a("string");
                expect(response.body).to.equal("Contenu public.");
                done();
            })
        })
    })
    describe("contenu user", function(){
        var url = "http://localhost:3000/test/user";
        it("bloque car pas de jeton", function(done){
            request(url, function(error, response, body){
                expect(response.statusCode).to.equal(403);
                done();
            })
        })
        let userTest = {
            firstName: "aurel",
            lastName: "atlas",
            emailId: "aurel@gmail.com",
            password: "bat"
        }
        url = "http://localhost:3000/auth/signup";
        it("crée un utilisateur", function(done){
            request(url, function (error, response, userTest){
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.a("string");
                expect(response.body).to.equal("L'utilisateur a été enregistré avec succès!");
                done();
            })
        })
        url = "http://localhost:3000/auth/signin";
        it("authentifie un utilisateur", function(done){
            request(url, function (error, response, userTest){
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.a("string");
                expect(response.body).to.equal("Contenu utilisateur.");
                done();
            })
        })
    })
})