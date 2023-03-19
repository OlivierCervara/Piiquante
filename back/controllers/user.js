const { User } = require("../mongo")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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
    try {    
        const email = req.body.email
        const password = req.body.password
        const user = await User.findOne({email: email})
        console.log("user: ", user)

        const isPasswordOK = await bcrypt.compare(password, user.password)
        if (!isPasswordOK) {
            res.status(403).send({ message: "Mot de passe incorrect" })
        }
        const token = createToken(email)
        res.status(200).send({ userId: user?._id, token: token })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: "Erreur interne"})
    }}

function createToken(email) {
    const jwtPassword = process.env.JWT_PASSWORD
    return jwt.sign({email: email}, jwtPassword, {expiresIn: "24h"})
}

module.exports = { createUser, logUser }