const mongoose = require("mongoose")
const IMG = mongoose.model("IMG")
const keys = require('../config/keys')
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("cloudinary");

module.exports = (app) => {
    //--------Cloundinary handler start-------//
    //Cloudinary config object set up the auth and keys between server and cloudinary
    cloudinary.config({
        cloud_name: keys.CLOUD_NAME,
        api_key: keys.API_KEY,
        api_secret: keys.API_SECRET
    });

    //storage is refer to cloudinary setttings where to save the img, which format to accept and size.
    const storage = cloudinaryStorage({
        cloudinary: cloudinary,
        folder: "demo",
        allowedFormats: ["jpg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }]
    });

    //Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files
    const parser = multer({ storage: storage });
    //--------Cloundinary handler stop-------//

    app.post("/api/shoppingbay/add-image",parser.single("img"), (req, res) => {
        if (req.file) {
            let image = new IMG()
            image.img = req.file.url
            res.status(200).send(image.img)
        }
        else {
            res.status(400).send("Error")
        }
    })
}