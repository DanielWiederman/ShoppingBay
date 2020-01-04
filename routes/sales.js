const mongoose = require("mongoose");
const SALES = mongoose.model("SALES");
const PRODUCT = mongoose.model("PRODUCT");
const moment = require("moment");

module.exports = app => {
  app.post("/api/shoppingbay/add-sale", (req, res) => {
    SALES.findOne({ saleName: req.body.saleName })
      .then(sale => {
        if (sale === null) {
          let newSale = new SALES(req.body);
          newSale
            .save()
            .then(newSale => {
              res.send(newSale);
            })
            .catch(err => {
              res.send(err);
            });
        } else {
          res.send("this sale name already used");
        }
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.post("/api/shoppingbay/remove-sale", (req, res) => {
    SALES.findOneAndRemove({ _id: req.body._id })
      .then(sale => {
        res.send(sale);
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.post("/api/shoppingbay/get-all-sale", (req, res) => {
    SALES.find()
      .then(sales => {
        res.send(sales);
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.post("/api/shoppingbay/get-sale-by-id", (req, res) => {
    SALES.findById(req.body.data)
      .then(sales => {
        res.send(sales);
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.post("/api/shoppingbay/update-sale", (req, res) => {
    SALES.findOneAndUpdate({ _id: req.body._id }, req.body.saleChange)
      .then(sale => {
        res.send(sale);
      })
      .catch(err => {
        res.status("400").send(err);
      });
  });

  app.post("/api/shoppingbay/get-all-saleAndProducts", (req, res) => {
    var index = 0;
    let saleAndProds = []

    SALES.find().lean().then(allSales => {
      PRODUCT.find().lean().then(allProducts => {
        allSales.map(sale => {
          saleAndProds.push({ sale: sale, allProds: [] });
          allProducts.map(product => {
            sale.prods.map(saleProds => {
              if (saleProds.prodId == product._id) {
                saleAndProds[index].allProds.push(product)
              }
              index++;
              if (index === allSales.length) {
                res.send(saleAndProds)
              }
            })
          })

        })
      }).catch(err => {
        res.send(err)
      })
        .catch(err => {
          res.send(err);
        });
    });
  });

  app.post("/api/shoppingbay/get-all-sale-products-by-id", (req, res) => {
    var counter = 0;
    var index = 0;
    var nowDate = new Date();
    nowDate = moment(nowDate, "DD-MM-YYYY");
    SALES.findById(req.body._id)
      .lean()
      .then(allSales => {
        let dateEnd = moment(allSales.dateEnd, "DD-MM-YYYY");
        var diff = dateEnd.diff(nowDate, "days");
        if (diff >= 0) {
          var saleAndProds = { sale: allSales, allProds: [] };
          allSales.prods.map(saleProds => {
            PRODUCT.findById(saleProds.prodId)
              .lean()
              .then(product => {
                saleAndProds.allProds.push(product);
                counter++;
                index++;
                if (saleAndProds.allProds.length === allSales.prods.length) {
                  res.send(saleAndProds);
                }
              })
              .catch(err => {
                res.send(err);
              });
          });
        } else {
          index++;
          if (index === allSales.length) {
            res.send(saleAndProds);
          }
        }
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

  app.post("/api/shoppingbay/get-active-sales", (req, res) => {
    let allSale = [];
    var nowDate = new Date();
    nowDate = moment(nowDate, "DD-MM-YYYY");
    SALES.find()
      .lean()
      .then(allSales => {
        allSales.map(sales => {
          let dateEnd = moment(sales.dateEnd, "DD-MM-YYYY");
          var diff = dateEnd.diff(nowDate, "days");
          if (diff >= 0) {
            allSale.push(sales);
          }
        });
        res.send(allSale);
      })
      .catch(err => {
        res.send(err);
      });
  });
};
