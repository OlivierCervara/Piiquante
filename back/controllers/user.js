const {User} = require("../mongo")
const bcrypt = require("bcrypt")

async function createUser(req, res) {
    const { email, password } = req.body

    const hashedPassword = await hashPassword(password)

    const user = new User({ email, password: hashedPassword })

    user.save()
        .then(() => res.status(201).send({ message: "Utilisateur enregistre !" }))
        .catch((err) => res.status(409).send({ message: "Utilisateur pas enregistre" + err }))
}

function hashPassword(password) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

async function logUser(req, res) {
    const { email, password } = req.body
    const user = await User.findOne({email: email})

    const isPasswordOK = bcrypt.compare(password, user.password)
}

module.exports = {createUser, logUser}