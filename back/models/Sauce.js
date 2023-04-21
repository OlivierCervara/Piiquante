const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({ // Definition modèle de données pour une collection de produits dans la base de données 
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type:String, required: true},
    description : {type:String, required: true},
    mainPepper : {type:String, required: true},
    imageUrl : {type:String, required: true},
    heat : {type:Number, required: true},
    likes :{type: Number, default: 0}, 
    dislikes : {type: Number, default: 0},
    usersLiked : {type: [String], default: []},
    usersDisliked : {type: [String], default: []},
})

module.exports = mongoose.model("Product", productSchema)