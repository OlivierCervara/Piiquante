require('dotenv').config
const express = require('express'); // Importe le module Express pour créer une application web.
const app = express(); // Crée une application Express.
const cors = require("cors") // Importe le module cors pour permettre les requêtes CORS (Cross-Origin Resource Sharing) à travers le serveur.
const port = 3000 // Définit le numéro de port pour le serveur.

// Connection to database
require("./mongo.js")

// Controllers
const {createUser} = require("./controllers/user.js")

// Middleware
app.use(cors())
app.use(express.json)
// Configure le middleware de l'application pour prendre en charge les demandes POST JSON et autoriser les requêtes CORS.

// Routes
// Une route POST est définie pour permettre l'inscription d'un nouvel utilisateur à l'aide du modèle User défini précédemment. 
// La route GET définit une réponse de base à la racine de l'application. 
app.post("/api/auth/signup", createUser)   
app.get("/", (req, res) => res.send("Hello World !"))

// Listen
app.listen(port, () => console.log("Listening on port ", + port))