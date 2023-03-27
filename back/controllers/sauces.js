const mongoose = require("mongoose")
const { unlink } = require("fs/promises")

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
    Product.find({})
            .then(products => res.send(products))
            .catch(error => res.status(500).send(error))
}

function getSaucesById(req, res) {
    const {id} = req.params
    Product.findById(id)
        .then(product => res.send(product))
        .catch(console.error)
}

function deleteSauce(req, res) {
    const {id} = req.params

    Product.findByIdAndDelete(id)
            .then((product) => sendClientResponse(product, res))
            .then((item) => deleteImage(item))
            .then((res) => console.log("File deleted", res))
            .catch(err => res.status(500).send({message: err}))
}

function modifySauce(req, res) {
    const {
        params: {id}
    } = req
    
    const hasNewImage = req.file != null
    const payload = makePayload(hasNewImage, req)

    Product.findByIdAndUpdate(id, payload)
        .then((dbResponse) => sendClientResponse(dbResponse, res))
        .then((product) => deleteImage(product))
        .then((res) => console.log("File deleted", res))
        .catch((err) => console.error("Problem updating", err))
}

function deleteImage(product) {
    if (product == null) return
    console.log("DELETE IMAGE", product)
    const imageToDelete = product.imageUrl.split("/").at(-1)
    return unlink("images/" + imageToDelete)
}

function makePayload(hasNewImage, req) {
    console.log("hasNewImage: ", hasNewImage)
    if (!hasNewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = makeImageUrl(req, req.file.fileName)
    console.log("Nouvelle image a gerer")
    console.log("voici le payload: ", payload)
    return payload
}

function sendClientResponse(product, res) {
    if (product == null) {
        console.log("NOTHING TO UPDATE")
        return res.status(404).send({ message: "Object not founc in database"})
    } 
    console.log("ALL GOOD, UPDATING: ", product)
    return Promise.resolve(res.status(200).send({ message: "Successfully updated" })).then(
        () => product
    )
}

function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName
}

function createSauce(req, res) {
    const { body, file } = req
    console.log({ file })
    const { fileName } = file
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce

    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: makeImageUrl(req, fileName),
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    product.save()
            .then((message)=> {
                res.status(201).send({ message: message })
                return console.log("produit save", message)
            })
            .catch(console.error)
}

module.exports = { getSauces, createSauce, getSaucesById, deleteSauce, modifySauce }