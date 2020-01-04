const mongoose = require("mongoose")
const PRODUCT = mongoose.model("PRODUCT")
const HOTPRODUCTS = mongoose.model("HOTPRODUCTS")
module.exports = (app) => {

    app.post("/api/shoppingbay/add-hot-product", (req, res) => {
        HOTPRODUCTS.find().then(hotProds => {
            if (!hotProds[0]) {
                let newHotProds = new HOTPRODUCTS({ prods: [{ prodId: req.body.prodId }] })
                console.log(req.body.prodId)
                newHotProds.save().then(newHotProd => {
                    PRODUCT.findById(req.body.prodId).then(product => {
                        product.hotProd = true
                        product.save().then(productSaved => {
                            res.status(200).send(productSaved);
                        }).catch(err => {
                            res.status(400).send(err);
                        })
                    }).catch(err => {
                        res.send(err)
                    })
                }).catch(err => {
                    res.send(err)
                })

            } else if (hotProds[0].prods.length <= 5) {
                let flag = 0
                hotProds[0].prods.map(index => {
                    if (index.prodId === req.body.prodId) {
                        flag = 1
                    }
                })
                if (flag) {
                    res.status(400).json({ type: 'error', msg: "This product allrady hot" });
                }
                else {
                    hotProds[0].prods.push({ prodId: req.body.prodId })
                    hotProds[0].save().then(hotProdsSaved => {
                        PRODUCT.findById(req.body.prodId).then(prod => {
                            prod.hotProd = true;
                            prod.save()
                        })
                        res.send(hotProdsSaved)
                    }).catch(err => {
                        res.send(err)
                    })
                }
            }
            else {
                res.status(400).json({ type: 'error', msg: "Can't add more than 6" });
            }
        }).catch(err => {
            res.send(err)
        })
    })

    app.post("/api/shoppingbay/remove-hot-product", (req, res) => {
        HOTPRODUCTS.find().then(hotProds => {
            hotProds[0].prods = hotProds[0].prods.filter(index => index.prodId !== req.body.prodId)
            hotProds[0].save().then(hotProdsSaved => {
                PRODUCT.findById(req.body.prodId).then(prod => {
                    prod.hotProd = false;
                    prod.save()
                })
                res.send(hotProdsSaved)
            }).catch(err => {
                res.send(err)
            })
        }).catch(err => {
            res.status("400").send(err)
        })
    })

    app.get("/api/shoppingbay/get-all-hot-product", (req, res) => {
        var allProds = []
        var counter = 0
        HOTPRODUCTS.find().then(hotProds => {
            hotProds[0].prods.map(index => {
                PRODUCT.findById(index.prodId).then(prod => {
                    allProds.push(prod)
                    counter++;
                    if (counter === hotProds[0].prods.length) {
                        res.send(allProds)
                    }
                }).catch(err => {
                    res.send(err)
                })
            })
        }).catch(err => {
            res.send(err)
        })
    })
}