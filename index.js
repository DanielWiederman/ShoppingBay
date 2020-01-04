const express = require("express");
const app = express();
const mongoos = require("mongoose");
const keys = require("./config/keys");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoos.Promise = global.Promise;

mongoos.connect(keys.MONGO_DB, { useNewUrlParser: true, useCreateIndex: true }, (err, db) => {
    if (err) {
        console.log("Error To Connected", err);
    } else {
        console.log("Connected")

    }
    require("./models/product");
    require("./models/user");
    require("./models/productReviews");
    require("./models/favorit");
    require("./models/img");
    require("./models/sales")
    require("./models/productSales")
    require("./models/order")
    require("./models/hotProducts")

    require("./routes/user")(app);
    require("./routes/favorit")(app);
    require("./routes/product")(app);
    require("./routes/img")(app);
    require("./routes/sales")(app);
    require("./routes/order")(app);
    require("./routes/hotProducts")(app);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(PORT);
    })
})