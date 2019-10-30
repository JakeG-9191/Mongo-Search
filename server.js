var express = require("express");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var app = express();

var PORT = process.env.PORT || 3000;
var routes = require("./controllers/mainController.js");

app.use(routes);
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// var databaseUrl = "webScrape";
// var collections = ["WashingtonPost"];

var db = require("./models");
mongoose.connect("mongodb://localhost/WashingtonPost", { useNewUrlParser: true });

app.get("/", function (req, res) {
    res.send("Hello world");
  });  

app.get("/api/all", function (req, res) {
    db.WashingtonPost.find({}, function (err, data) {
        if (err) return res.status(500).end();
        res.json(data)
    })
})

app.get("/scrape", function (req, res) {
    axios.get("http://www.washingtonpost.com/")
        .then(function (response) {
            var $ = cheerio.load(response.data);

            $("div.headline").each(function (i, element) {
                var newScrape = {};

                result.title = $(this)
                .children("a")
                .text();
              result.link = $(this)
                .children("a")
                .attr("href");

                // var title = $(element).children().text();
                // var link = $(element).find("a").attr("href");

                // db.WashingtonPost.insert({
                //     "title": title,
                //     "link": link
                // })

                db.Article.create(data)
                    .then(function(dbArticle){
                        console.log(dbArticle)
                    })
                    .catch(function(err){
                        console.log(err)
                    })
            });
            res.send("Scrape Has Completed!")
        })
});

app.get("/articles", function(req, res){
    db.Article.find({})
        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            res.json(err)
        })
})

app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});