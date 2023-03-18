const { User } = require("../mongo")
const bcrypt = require("bcrypt")

async function createUser(req, res) {
    const { email, password } = req.body

    const hashedPassword = await hashPassword(password)

    const user = new User({ email, password: hashedPassword })
    
    user.save()
        .then(() => res.status(201).send({ message: "Utilisateur enregistré avec succès!" }))
        .catch((err) => res.status(500).send({ message: "Erreur lors de l'enregistrement de l'utilisateur.", err }));
}

function hashPassword(password) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

async function logUser(req, res) {
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({email: email})

    const isPasswordOK = await bcrypt.compare(password, user.password)
    if (!isPasswordOK) {
        res.status(403).send({ message: "Mot de passe incorrect" })
    }
    if (isPasswordOK) {
        res.status(200).send({ message: "Connexion reussie" })
    }
    
    console.log("user: ", user)
    console.log("isPasswordOK: ", isPasswordOK)
}

module.exports = { createUser, logUser }