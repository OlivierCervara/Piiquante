const mongoose = require("mongoose"); // Le module mongoose est utilisé pour gérer les interactions avec la base de données. 
const USER = process.env.USER_DB;
const PASSWORD = process.env.PASSWORD_DB;
const DATABASE = process.env.NAME_DATABASE;
const uri = `mongodb+srv://${USER}:${PASSWORD}@${DATABASE}.c9uoz9q.mongodb.net/?retryWrites=true&w=majority` // la variable uri contient l'URL de connexion de la base de données.

mongoose.connect(uri)
	    .then(() => console.log('connected to Mongo'))
        .catch(error => console.error({error}));
// Définit un schéma de modèle utilisateur qui spécifie la structure de la collection d'utilisateurs dans la base de données.
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model("User", userSchema)

module.exports = {mongoose, User}