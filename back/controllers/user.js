const { User } = require("../mongo")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

/**
 * Crée un nouvel utilisateur avec un e-mail et un mot de passe fournis dans la requête HTTP.
 *
 * @async
 * @param {Object} req - L'objet de requête HTTP pour la requête en cours.
 * @param {Object} res - L'objet de réponse HTTP pour la requête en cours.
 * @returns {Promise} - Une promesse résolue lorsque l'utilisateur est enregistré avec succès ou rejetée avec une erreur en cas d'échec de l'enregistrement.
 */
async function createUser(req, res) {
    const { email, password } = req.body
    const hashedPassword = await hashPassword(password)
    const user = new User({ email, password: hashedPassword })
    
    user.save()
        .then(() => res.status(201).send({ message: "Utilisateur enregistré avec succès!" }))
        .catch((err) => res.status(500).send({ message: "Erreur lors de l'enregistrement de l'utilisateur.", err }));
}

/**
 * Hashe un mot de passe en utilisant bcrypt avec 10 salt rounds.
 *
 * @param {string} password - Le mot de passe a hasher.
 * @returns {Promise<string>} - Une promesse qui se résout au mot de passe hashé sous forme de chaîne de caractères.
 */
function hashPassword(password) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

/**
 * Authentifie un utilisateur en comparant son adresse email et son mot de passe avec ceux stockés dans la base de données.
 *
 * @async
 * @param {Object} req - L'objet de requête HTTP pour la requête en cours.
 * @param {Object} res - L'objet de réponse HTTP pour la requête en cours.
 * @returns {Promise} - Une promesse résolue avec un objet contenant l'ID d'utilisateur et le jeton d'authentification, ou rejetée avec une erreur en cas d'échec de l'authentification.
 */
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
    }
}

/**
 * Crée un jeton d'authentification JWT pour l'adresse email fournie.
 *
 * @param {string} email - L'adresse email de l'utilisateur pour lequel le jeton est créé.
 * @returns {string} - Le jeton d'authentification JWT créé sous forme de chaîne de caractères.
 */
function createToken(email) {
    const jwtPassword = process.env.JWT_PASSWORD
    return jwt.sign({email: email}, jwtPassword, {expiresIn: "24h"})
}

module.exports = { createUser, logUser }