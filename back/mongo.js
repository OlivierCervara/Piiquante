const mongoose = require('mongoose'); // Le module mongoose est utilisé pour gérer les interactions avec la base de données. 
const password =  process.env.DB_PASSWORD // La variable password contient le mot de passe pour se connecter à la base de données
const username = process.env.DB_USER
const db = process.env.DB_NAME
const uri = `mongodb+srv://${username}:${password}@${db}.c9uoz9q.mongodb.net/?retryWrites=true&w=majority` // la variable uri contient l'URL de connexion de la base de données.

mongoose.connect(uri)
	    .then(() => console.log('connected to Mongo'))
	    .catch((err) => console.error("Error connecting to Mongo: ", err));

// Définit un schéma de modèle utilisateur qui spécifie la structure de la collection d'utilisateurs dans la base de données.
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model("User", userSchema)

module.exports = {mongoose, User}