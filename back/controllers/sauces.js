const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number, 
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})
const Product = mongoose.model("Product", productSchema)

function getSauces(req, res) {
    console.log("le token a ete valider, nous sommes dans get")
    authenticateUser(req, res)
    console.log("le token a l'air bon", decoded)
    Product.find({}).then(products => res.send(products)) 
}

function createSauce(req, res) {
    const sauce = JSON.parse(req.body.sauce)

    const {name, manufacturer, description, mainPepper, heat, userId} = sauce
    console.log("sauce: ", sauce)

    console.log({ body: req.body })
    console.log({ file: req.file })
    const imagePath = req.file.destination + req.file.filename
    console.log("imagePath: ", imagePath)

    const product = new Product({
        userId: "pouet",
        name: "pouet",
        manufacturer: "pouet",
        description: "pouet",
        mainPepper: "pouet",
        imageUrl: "pouet",
        heat: 2,
        likes: 2,
        dislikes: 2,
        usersLiked: ["pouet"],
        usersDisliked: ["pouet"]
    })
    product.save().then((res)=> console.log("produit save", res)).catch(console.error)
}

module.exports = { getSauces, createSauce }