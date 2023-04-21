const { createUser, logUser } = require("../controllers/user")

const express = require("express")
const authRouter = express.Router() // crée un routeur express pour les routes d'authentification.
authRouter.post("/signup", createUser) //définit la création d'un nouvel utilisateur lorsqu'un POST est reçu sur cette route.
authRouter.post("/login", logUser) //définit la connexion d'un utilisateur lorsqu'un POST est reçu sur cette route.

module.exports = {authRouter}
