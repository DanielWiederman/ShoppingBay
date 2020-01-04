const mongoose = require("mongoose")
const FAVORIT = mongoose.model("FAVORIT")
const PRODUCT = mongoose.model("PRODUCT")

module.exports = (app) => {

    app.post("/api/shoppingbay/get-favorit-product-id-by-user-id", (req, res) => {
        FAVORIT.find({ userId: req.body.userId }).then(userFavorit => {
            if (userFavorit !== null) {
                res.status(200).send(userFavorit);
            } else {
                res.status(400).send([])
            }
        }).catch(err => {
            res.status(400).send(err)
        })
    })

    app.post("/api/shoppingbay/toggle-item", (req, res) => {
        FAVORIT.find({ userId: req.body.userId, productId: req.body.productId }).then(userFavorit => {
            if (userFavorit.length) {
                FAVORIT.findOneAndRemove({ userId: req.body.userId, productId: req.body.productId }).then(userFavorit => {
                    res.status(200).json({ msg: "Removed from favorite" });
                }).catch(err => {
                    res.status(400).send(err)
                })
            } else {
                let newuserFavorit = new FAVORIT(req.body)
                newuserFavorit.save().then(userFavorit => {
                    res.status(200).json({ msg: "Added to favorite" });
                }).catch(err => {
                    res.status(400).send(err)
                })
            }
        }).catch(err => {
            res.status(400).send(err)
        })
    })
    app.post("/api/shoppingbay/get-favorit-products-by-user-id", (req, res) => {
        FAVORIT.find({ userId: req.body.userId }).lean().then(userFavorit => {
            if (userFavorit.length) {
                var index = 0;
                userFavorit.map(favorit => {
                    PRODUCT.findById(favorit.productId).lean().then(product => {
                        favorit.product = product
                        index++;
                        if (index === userFavorit.length) {
                            res.status(200).send(userFavorit)
                        }
                    }).catch(err => {
                        res.status(400).send(err)

                    })
                })

            } else {
                res.status(400).send([])
            }
        }).catch(err => {
            res.status(400).send(err)
        })
    })

}