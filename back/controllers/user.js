const { User } = require("../mongo")
const bcrypt = require("bcrypt")

async function createUser(req, res) {
    const { email, password } = req.body

    const hashedPassword = await hashPassword(password)

    const user = new User({ email, password: hashedPassword })

    user.save()
        .then(() => res.send({ message: "Utilisateur enregistre !" }))
        .catch(err => console.log("User pas enregistre", err)) 
}

function hashPassword(password) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

function logUser(req, res) {}

module.exports = {createUser, logUser}