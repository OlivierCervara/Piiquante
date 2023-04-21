const {User} = require("../models/User") // Importe le modèle User de la base de données MongoDB.
const bcrypt = require("bcrypt") // permet de chiffrer des mots de passe.
const jwt = require("jsonwebtoken") // Importe la bibliothèque jsonwebtoken qui permet de générer et de vérifier des jetons d'authentification.

async function createUser(req, res) { // crée un nouvel utilisateur enregistré dans la base de données et renvoie une réponse appropriée 
  const { email, password } = req.body // Récupère l'e-mail et le mot de passe de l'utilisateur à partir de la requête HTTP.
  const hashedPassword = await hashPassword(password) // Chiffre le mot de passe à l'aide de la fonction hashPassword.
  const user = new User({ email, password: hashedPassword }) // Crée un nouvel utilisateur avec l'e-mail et le mot de passe chiffré.
  
  user.save() // Enregistre le nouvel utilisateur dans la base de données et renvoie une réponse HTTP 201 si la sauvegarde est réussie, sinon une réponse HTTP 500 avec un message d'erreur.
    .then(() => res.status(201).send({ message: "Utilisateur enregistré avec succès!" }))
    .catch((err) => res.status(500).send({ message: "Erreur lors de l'enregistrement de l'utilisateur.", err }));
}

function hashPassword(password) { // prend un mot de passe et le chiffre à l'aide de la fonction bcrypt.hash.
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

async function logUser(req, res) { // vérifie si les informations de connexion fournies par l'utilisateur sont correctes, puis renvoie un jeton d'authentification si elles le sont
  try {    
    const email = req.body.email // Récupère l'e-mail de l'utilisateur à partir de la requête HTTP.
    const password = req.body.password
    const user = await User.findOne({email: email}) // Recherche l'utilisateur dans la base de données à partir de son e-mail.

    const isPasswordOK = await bcrypt.compare(password, user.password) // Vérifie si le mot de passe fourni correspond à celui stocké dans la base de données.
    if (!isPasswordOK) { // Si le mot de passe est incorrect, renvoie une réponse HTTP 403 avec un message d'erreur.
      res.status(403).send({ message: "Mot de passe incorrect" })
    }
    const token = createToken(email) // Si le mot de passe est correct, génère un jeton d'authentification à l'aide de la fonction createToken.
    res.status(200).send({ userId: user?._id, token: token }) // Renvoie une réponse HTTP 200 avec l'identifiant de l'utilisateur et le jeton d'authentification.
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Erreur interne"})
  }
}

function createToken(email) { // crée un jeton d'authentification à partir de l'e-mail de l'utilisateur :
  const jwtPassword = process.env.JWT_PASSWORD // Récupère le mot de passe JWT depuis les variables d'environnement.
  return jwt.sign({email: email}, jwtPassword, {expiresIn: "24h"}) // Crée et renvoie un jeton d'authentification avec l'e-mail de l'utilisateur, le mot de passe JWT et une durée de validité de 24 heures.
}

module.exports = { createUser, logUser }
