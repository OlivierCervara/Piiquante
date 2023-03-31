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

function getSauce(req, res) {
    const {id} = req.params
    return Product.findById(id)
}

function getSaucesById(req, res) {
    getSauce(req, res)
        .then(product => sendClientResponse(product, res))
        .catch((err) => res.status(500).send(err))
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
    return Promise.resolve(res.status(200).send(product)).then(
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
            .then((message) => res.status(201).send({ message }))
            .catch((err) => res.status(500).send(err))
}

function likeSauce(req, res) {
    const { like, userId } = req.body
    //console.log("Fonction like sauce invoquee", {like})
    if (![0, -1, 1].includes(like)) return res.status(400).send({ message: "bad request"})
    //console.log("Ce message n'apparaitra que si like vaut 0, -1 ou 1")
    //console.log("like, userId: ", like,userId)

    getSauce(req, res)
        .then((product) => updateVote(product, like, userId, res))
        .then(pr => pr.save())
        .then(prod => sendClientResponse(prod, res))
        .catch((err) => res.status(500).send(err))
}

function updateVote(product, like, userId, res) {
    if (like === 1 || like === -1) return incrementVote(product, userId, like)
    return resetVote(product, userId, res)
}

function resetVote(product,userId,res) {
    const { usersLiked, usersDisliked } = product
    if ([usersLiked, usersDisliked].every(arr => arr.includes(userId))) 
        return Promise.reject("User seems to have voted both ways")

    if (![usersLiked, usersDisliked].some(arr => arr.includes(userId))) 
        return Promise.reject("User seems to have not voted")

    if (usersLiked.includes(userId)) {
        --product.likes
        product.usersLiked = product.usersLiked.filter(id => id !== userId)
    } else {
        --product.dislikes
        product.usersDisliked = product.usersDisliked.filter(id => id !== userId)
    }

    return product
}

function incrementVote(product, userId, like) {
    const { usersLiked, usersDisliked } = product

    const votersArray = like ===1 ? usersLiked : usersDisliked
    if (votersArray.includes(userId)) return product
    votersArray.push(userId)

    if (like === 1) {
        ++product.likes
    } else {
        ++product.dislikes 
    }
    return product
}

module.exports = { getSauces, createSauce, getSaucesById, deleteSauce, modifySauce, likeSauce }