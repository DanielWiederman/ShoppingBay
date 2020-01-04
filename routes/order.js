const mongoose = require("mongoose")
const ORDER = mongoose.model("ORDER");
const PRODUCT = mongoose.model("PRODUCT")
const USER = mongoose.model("USER");
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shoppingbay2@gmail.com',
        pass: 'A159632147a'
    }
});


module.exports = (app) => {

    app.post("/api/shoppingbay/new-order", (req, res) => {
        let sum = 0;
        req.body.products.forEach(ordersProduct => {
            sum += ordersProduct.buyQuantity * parseInt(ordersProduct.product.price)
        })
        req.body.totalSum = sum
        let newOrder = new ORDER(req.body)
        newOrder.save().then(orderSaved => {
            req.body.products.forEach(product => {
                PRODUCT.findById(product.product._id).then(prod => {
                    if (prod.quantity - product.buyQuantity >= 0) {
                        prod.quantity -= product.buyQuantity
                        prod.save().then(prodSave => {
                        }).catch(err => {
                            res.status(400).send(err)
                        })
                    }
                }).catch(err => {
                    res.status(400).send(err)
                })
            })
            USER.findById(req.body.userId).then(user => {
                var mailOptions = {
                    from: 'shoppingbay2@gmail.com',
                    to: user.email,
                    subject: 'Order:' + orderSaved._id,
                    html: `<div> Dear ${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()},<br/><br/>
                    On behalf of ShoppingBay, We would like to thank you for purchased.
                    We sincerely hope that you will continue to enjoy ShoppingBay.<br/><br/>   
                    You can view your order <a href="http://localhost:3000/order?q=${orderSaved._id}">here<a/>.<br/><br/>
                    If you have any questions or if we can further assist you in any way, please feel free to email us at shoppingbay2@gmail.com (you also can replay to this message).
                    <br/><br/>
                    We hope to hear from you soon!<br/><br/>
                    Thank you once again,<br/><br/>
                    ShoppingBay</div>`
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        res.status(400).json({ type: 'error', msg: err });
                    } else {
                        res.status(200).json({ orderId: orderSaved._id });
                    }
                })
            }).catch(err => {
                res.status(400).send(err)

            })
        }).catch(err => {
            res.status(400).send(err)
        })
    })

    app.post("/api/shoppingbay/get-order-by-user-id", (req, res) => {
        ORDER.find({ userId: req.body.userId }).then(orders => {
            if (orders !== null) {
                res.send(orders)
            } else {
                res.status(400).send([])
            }
        }).catch(err => {
            res.status(400).send(err)
        })
    })

    app.post("/api/shoppingbay/get-all-orders", (req, res) => {
        ORDER.find().lean().then(allOrders => {
            if (allOrders !== null) {
                var index = 0;
                allOrders.map(order => {
                    USER.findById(order.userId).lean().then(user => {
                        user.tokens = undefined
                        user.secQes = undefined
                        user.secAns = undefined
                        user.lock = undefined;
                        user.admin = undefined
                        user.password = undefined
                        order.user = user
                        index++;
                        if (index === allOrders.length) {
                            res.status(200).send(allOrders)
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

    app.post("/api/shoppingbay/update-order", (req, res) => {
        ORDER.findByIdAndUpdate(req.body.orderId, { status: req.body.status }).then(order => {
            if (req.body.status === "shipped") {
                USER.findById(order.userId).then(user => {
                    var mailOptions = {
                        from: 'shoppingbay2@gmail.com',
                        to: user.email,
                        subject: 'Order:' + order._id,
                        html: `<div></div>`
                    };
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            var userFullName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) + " " + user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)
                            res.status(200).json({ msg: "The order was changed and mail sended to " + userFullName });
                        }
                    })

                }).catch(err => {
                    res.status(400).send(err);
                })
            } else {
                res.status(200).json({ msg: "The order status was changed" });
            }

        }).catch(err => {
            res.status(400).send(err)
        })
    })

    app.post("/api/shoppingbay/get-order-by-id", (req, res) => {
        ORDER.findById(req.body.orderId).then(order => {
            if (order !== null) {
                res.send(order)
            } else {
                res.status(400).send([])
            }
        }).catch(err => {
            res.status(400).send(err)
        })
    })

    app.post("/api/shoppingbay/cancel-order", (req, res) => {
        ORDER.findById(req.body.orderId).then(order => {
            if (order !== null) {
                order.status = "cancel";
                let prodQuantity = 0;
                order.save().then(orderSaved => {
                    orderSaved.products.forEach(product => {
                        PRODUCT.findById(product.product._id).then(prod => {
                            prodQuantity = parseInt(prod.quantity, 10) + parseInt(product.buyQuantity, 10)
                            prod.quantity = prodQuantity.toString()
                            prod.save().then(prodSave => {
                            }).catch(err => {
                                res.status(400).send(err)
                            })
                        }).catch(err => {
                            res.status(400).send(err)
                        })
                    });
                }).catch(err => {
                    res.status(400).send(err)
                })
                res.status(200).json({ msg: "The order was canceled " });

            } else {
                res.status(400).send([])
            }

        }).catch(err => {
            res.status(400).send(err)
        })
    })
}
