const {User} = require("../mongo.js")

function createUser(req, res) {
    const { email, password } = req.body
    const user = new User({ email, password })

    user.save()
        .then(() => res.send({ message: "Utilisateur enregistre !" }))
        .catch(err => console.log("User pas enregistre", err)) 
}

module.exports = {createUser}