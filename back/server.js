require("dotenv").config() //pour la gestion des variables d'environnement.
const express = require("express") //pour la création de l'application web
const app = express()
const cors = require("cors") //pour autoriser les requêtes provenant de différents domaines.

// Middlewares
app.use(cors())
app.use(express.json()) //permet de parser le corps des requêtes en JSON

module.exports = {app, express}