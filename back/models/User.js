const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({ // définit un schéma pour les utilisateurs. Le schéma spécifie que chaque utilisateur aura une propriété email de type String, obligatoire et unique, et une propriété password de type String, également obligatoire.
    email: {type: String, required: true, unique: true}, //attribut unqiue pour qu'il n'y ait pas de doublons dans la base de donnees.
    password: {type: String, required: true}
})

const User = mongoose.model("User", userSchema) // crée un modèle User à partir du schéma et le lie à la collection "users" de la base de données.

module.exports = { User }