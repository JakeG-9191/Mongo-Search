var express = require("express");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var app = express();

var PORT = process.env.PORT || 3000;
// var routes = require("./controllers/mainController.js");

app.use(routes);
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

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

                newScrape.title = $(this)
                    .children("a")
                    .text();
                newScrape.link = $(this)
                    .children("a")
                    .attr("href");

                // var title = $(element).children().text();
                // var link = $(element).find("a").attr("href");

                db.Article.create(data)
                    .then(function (dbArticle) {
                        console.log(dbArticle)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            });
            res.send("Scrape Has Completed!")
        })
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.json(err)
        })
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function (data) {
            res.json(data)
        })
        .catch(function (err) {
            res.json(err)
        })
});

app.post("/articles/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (data) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { comment: data._id } }, { new: true })
        })
        .then(function (data) {
            res.json(data)
        })
        .catch(function (err) {
            res.json(err)
        })
})

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});