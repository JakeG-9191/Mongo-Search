var express = require("express");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

var db = require("./models");
var app = express();

var PORT = process.env.PORT || 8080;

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

require("./routes/apiRoutes")(app);
require("./routes/html")(app);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/WashingtonPost", { useNewUrlParser: true });

mongoose.connect("mongodb://localhost/WashingtonPost", function () {
    mongoose.connection.db.dropDatabase()
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});