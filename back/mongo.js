// Database
const mongoose = require("mongoose"); // Le module mongoose est utilisé pour gérer les interactions avec la base de données. 
const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
const db = process.env.DB_NAME
const uri = `mongodb+srv://${username}:${password}@${db}.c1ssuzp.mongodb.net/?retryWrites=true&w=majority` //URL de connexion et securisation avec variables d'environnement

mongoose
    .connect(uri)
    .then(() => console.log("Connected to Mongo!"))
    .catch((err) => console.error("Error connecting to Mongo: ", err))

const userSchema = new mongoose.Schema({ //definit un schema pour les utilisateurs avec deux proprietes.
    email: {type: String, required: true, unique: true}, //attribut unqiue pour qu'il n'y ait pas de doublons dans la base de donnees.
    password: {type: String, required: true}
})

const User = mongoose.model("User", userSchema)

module.exports = { mongoose, User }
