const mongoose = require("mongoose");
const PRODUCT = mongoose.model("PRODUCT");
const PRODUCTREVIEWS = mongoose.model("PRODUCTREVIEWS");
const SALES = mongoose.model("SALES");
const HOTPRODUCTS = mongoose.model("HOTPRODUCTS")
const FAVORIT = mongoose.model("FAVORIT")


module.exports = app => {
  app.post("/api/shoppingbay/add-product", (req, res) => {
    let product = new PRODUCT(req.body);
    product
      .save()
      .then(product => {
        res.send(product);
      })
      .catch(err => {
        res.status("400").send(err);
      });
  });

  app.post("/api/shoppingbay/get-all-products", (req, res) => {
    PRODUCT.find()
      .then(products => {
        res.send(products);
      })
      .catch(err => {
        res.send(err);
      });
  });
  app.post("/api/shoppingbay/get-product-by-id", (req, res) => {
    PRODUCT.findById(req.body._id)
      .then(product => {
        if (product !== undefined) {
          res.send(product);
        } else {
          res.status(400).json({ type: "error" });
        }
      })
      .catch(err => {
        res.status(400).json({ type: "error" });
      });
  });

  app.post("/api/shoppingbay/get-product-by-name", (req, res) => {
    PRODUCT.findOne({ productName: req.body.productName })
      .then(products => {
        if (product !== undefined) {
          res.send(product);
        } else {
          res.status(400).json({ type: "error" });
        }
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.post("/api/shoppingbay/update-product", (req, res) => {
    PRODUCT.findOneAndUpdate({ _id: req.body.key }, req.body)
      .then(product => {
        res.send(product);
      })
      .catch(err => {
        res.status("400").send(err);
      });
  });

  app.post("/api/shoppingbay/remove-product", (req, res) => {
    PRODUCT.findOneAndRemove({ _id: req.body._id }).then(product => {
      SALES.find().lean().then(allSales => {
        var saleIndex = undefined;
        var hotProdFlag = false;
        var index = 0;
        var saleFalg = false;
        allSales.map(sale => {
          index++;
          sale.prods.map(saleProds => {
            if (saleProds.prodId === req.body._id) {
              saleIndex = sale
            }
          })
        })
        if (index === allSales.length) {
          if (saleIndex !== undefined) {
            SALES.findById(saleIndex._id).then(saleProds => {
              saleProds.prods = saleProds.prods.filter(index => index.prodId !== req.body._id)
              saleProds.save().then(saleProdsSaved => {
                saleFalg = true
                var index2 = 0
                HOTPRODUCTS.find().then(hotProds => {
                  index = hotProds[0].prods.length
                  hotProds[0].prods = hotProds[0].prods.filter(index => index.prodId !== req.body._id)
                  if (index2 !== hotProds[0].prods.length) {
                    hotProdFlag = true
                  }

                  hotProds[0].save().then(hotProdsSaved => {
                    FAVORIT.findOneAndRemove({ productId: req.body._id }).then(favoritsSaved => {
                      var msg = "The product has been deleted"
                      if (hotProdFlag && saleFalg) {
                        res.status(200).json({ msg: msg + " and removed from sale & hot Prod" });
                      } else if (saleFalg) {
                        res.status(200).json({ msg: msg + " and removed from sale " });
                      } else if (hotProdFlag) {
                        res.status(200).json({ msg: msg + " and removed from hot Prod" });
                      } else {
                        res.status(200).json({ msg: msg });
                      }
                    }).catch(err => {
                      res.status(400).send(err)
                    })
                  }).catch(err => {
                    res.status(400).send(err)
                  })

                })
              })
            })
          }
          else {
            var hotProdFlag = false;
            var index2 = 0
            HOTPRODUCTS.find().then(hotProds => {
              index2 = hotProds[0].prods.length
              hotProds[0].prods = hotProds[0].prods.filter(index => index.prodId !== req.body._id)
              if (index2 !== hotProds[0].prods.length) {
                hotProdFlag = true
              }
              hotProds[0].save().then(hotProdsSaved => {
                FAVORIT.findOneAndRemove({ productId: req.body._id }).then(favoritsSaved => {
                  var msg = "The product has been deleted"
                  if (hotProdFlag && saleFalg) {
                    res.status(200).json({ msg: msg + " and removed from sale & hot Prod" });
                  } else if (saleFalg) {
                    res.status(200).json({ msg: msg + " and removed from sale " });
                  } else if (hotProdFlag) {
                    res.status(200).json({ msg: msg + " and removed from hot Prod" });
                  } else {
                    res.status(200).json({ msg: msg });
                  }
                }).catch(err => {
                  res.status(400).send(err)
                })
              }).catch(err => {
                res.status(400).send(err)
              })
            })
          }
        }
      }).catch(err => {
        res.status(400).send(err);
      });
    });
  });

  app.get("/api/shoppingbay/get-categories", (req, res) => {
    PRODUCT.find()
      .lean()
      .then(products => {
        let productCategories = [];
        products.map(product => {
          if (!productCategories.includes(product.category) && product.quantity > 0) {
            productCategories.push(product.category);
          }
        });
        res.send(productCategories);
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.get("/api/shoppingbay/get-categories", (req, res) => {
    PRODUCT.find()
      .lean()
      .then(products => {
        let productCategories = [];
        products.map(product => {
          if (!productCategories.includes(product.category) && product.quantity > 0) {
            productCategories.push(product.category);
          }
        });
        res.send(productCategories);
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.post("/api/shoppingbay/get-product-by-category", (req, res) => {
    PRODUCT.find({ category: req.body.category })
      .then(products => {
        res.send(products);
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.post("/api/shoppingbay/get-prod-by-name", (req, res) => {
    var prods = []
    PRODUCT.find().lean()
      .then(products => {
        if (req.body.category !== "all") {
          products.map(prod => {
            if (prod.productName.toLowerCase().includes(req.body.productName.toLowerCase()) && prod.category === req.body.category) {
              prods.push(prod)
            }
          })
        } else {
          products.map(prod => {
            if (prod.productName.toLowerCase().includes(req.body.productName.toLowerCase())) {
              prods.push(prod)
            }
          })
        }
        prods.length ? res.send(prods) : res.status(400).send();
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

  //-------------------------------------------------------------reviews----------------------------------------------------------------
  app.post("/api/shoppingbay/add-review", (req, res) => {
    PRODUCTREVIEWS.findOne({ productId: req.body.productId })
      .then(productReviews => {
        productReviews.reviews.push({
          userId: req.body.reviews[0].userId,
          review: req.body.reviews[0].review
        });
        productReviews
          .save()
          .then(product => {
            res.send(product);
          })
          .catch(err => {
            res.send(err);
          });
      })
      .catch(err => {
        let productReview = new PRODUCTREVIEWS(req.body);
        productReview
          .save()
          .then(review => {
            res.send(review);
          })
          .catch(err => {
            res.send(err);
          });
      });
  });

  app.post("/api/shoppingbay/get-review-by-product-id", (req, res) => {
    PRODUCTREVIEWS.findOne({ productId: req.body.productId })
      .then(productReview => {
        res.send(productReview);
      })
      .catch(err => {
        res.send(err);
      });
  });
};
