const { User } = require("../mongo")
const bcrypt = require("bcrypt")

/**
 * Crée un utilisateur dans la base de données avec l'e-mail et le mot de passe fournis dans la requête.
 * Si l'e-mail est déjà utilisé, renvoie une réponse avec un code d'état HTTP 409.
 * Si une erreur se produit lors de l'enregistrement de l'utilisateur, renvoie une réponse avec un code d'état HTTP 500.
 * @param {import('express').Request} req - La requête HTTP envoyée par le client.
 * @param {import('express').Response} res - La réponse HTTP envoyée par le serveur.
 * @returns {Promise<void>}
 */
async function createUser(req, res) {
    const { email, password } = req.body

    const hashedPassword = await hashPassword(password)
    
    console.log('password: ', password)
    console.log('hashedPassword: ', hashedPassword)

    // Vérifier si l'utilisateur existe déjà dans la base de données
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(409).send({ message: "Cet e-mail est déjà utilisé." });
    }

    const user = new User({ email, password: hashedPassword })
    
    user.save()
        .then(() => res.status(201).send({ message: "Utilisateur enregistré avec succès!" }))
        .catch((err) => res.status(500).send({ message: "Erreur lors de l'enregistrement de l'utilisateur." }));
}

/**
 * Vérifie si l'e-mail et le mot de passe fournis correspondent à ceux d'un utilisateur existant dans la base de données.
 * Si les informations d'identification sont correctes, renvoie une réponse avec un code d'état HTTP 200.
 * Si les informations d'identification sont incorrectes, renvoie une réponse avec un code d'état HTTP 403.
 * @param {import('express').Request} req - La requête HTTP envoyée par le client.
 * @param {import('express').Response} res - La réponse HTTP envoyée par le serveur.
 * @returns {Promise<void>}
 */
async function logUser(req, res) {
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({ email: email})

    const isPasswordOK = await bcrypt.compare(password, user.password)
    if (!isPasswordOK) {
        res.status(403).send({ message: "Mot de passe incorrect" })
    }
    if (isPasswordOK) {
        res.status(200).send({ message: "Connexion réussie" })
    }
}

module.exports = {createUser, logUser}