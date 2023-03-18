const { User } = require("../mongo")

function createUser(req, res) {
    const { email, password } = req.body

    const user = new User({ email, password })
    
    user.save()
        .then(() => res.status(201).send({ message: "Utilisateur enregistré avec succès!" }))
        .catch((err) => res.status(500).send({ message: "Erreur lors de l'enregistrement de l'utilisateur." }));
}

module.exports = { createUser }