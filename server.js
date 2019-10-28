var express = require("express");
var mongojs = require("mongojs");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var databaseUrl = "webScrape";
var collections = ["WashingtonPost"];

var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

app.get("/", function (req, res) {
    res.send("Hello world");
  });  

app.get("/api/all", function (req, res) {
    db.WashingtonPost.find({}, function (err, data) {
        if (err) return res.status(500).end();
        res.json(data)
    })
})

app.get("/scraped", function (req, res) {
    axios.get("http://www.washingtonpost.com/")
        .then(function (response) {
            var $ = cheerio.load(response.data);

            $("div.headline").each(function (i, element) {
                var title = $(element).children().text();
                var link = $(element).find("a").attr("href");

                db.WashingtonPost.insert({
                    "title": title,
                    "link": link
                })
            });
            res.send("Scrape Initiated")
        })
})

app.listen(3000, function () {
    console.log("App running on port 3000!");
});