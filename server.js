var express = require("express");
var mongojs = require("mongojs");
var logger = require("morgan");
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var databaseUrl = "webScrape";
var collections = ["WashingtonPost"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.listen(3000, function () {
    console.log("App running on port 3000!");
});