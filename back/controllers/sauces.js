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
    //console.log("le token a ete valider, nous sommes dans get")
    authenticateUser(req, res)
    //console.log("le token a l'air bon", decoded)
    Product.find({}).then(products => res.send(products)) 
}

function createSauce(req, res) {
    const { body, file } = req
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce
    
    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        //imageUrl: imageUrl,
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    product.save()
            .then((res)=> console.log("produit save", res))
            .catch(console.error)
}

module.exports = { getSauces, createSauce }