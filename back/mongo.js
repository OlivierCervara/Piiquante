// Database
const mongoose = require("mongoose"); // Le module mongoose est utilisé pour gérer les interactions avec la base de données. 
const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
const db = process.env.DB_NAME
const uri = `mongodb+srv://${username}:${password}@${db}.c1ssuzp.mongodb.net/?retryWrites=true&w=majority` //URL de connexion et securisation avec variables d'environnement

mongoose // Si la connexion est réussie, le message "Connected to Mongo!" est affiché dans la console. Si la connexion échoue, l'erreur est affichée dans la console.
    .connect(uri)
    .then(() => console.log("Connected to Mongo!"))
    .catch((err) => console.error("Error connecting to Mongo: ", err))

const userSchema = new mongoose.Schema({ // définit un schéma pour les utilisateurs. Le schéma spécifie que chaque utilisateur aura une propriété email de type String, obligatoire et unique, et une propriété password de type String, également obligatoire.
    email: {type: String, required: true, unique: true}, //attribut unqiue pour qu'il n'y ait pas de doublons dans la base de donnees.
    password: {type: String, required: true}
})

const User = mongoose.model("User", userSchema) // crée un modèle User à partir du schéma et le lie à la collection "users" de la base de données.

module.exports = { mongoose, User }
