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

module.exports = { createUser }