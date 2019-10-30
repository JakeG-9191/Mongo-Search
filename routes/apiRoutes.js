// var request = require("request");
var mongoose = require('mongoose');
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
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
    
                    db.Article.create(newScrape)
                        .then(function(dbArticle) {
                            console.log(dbArticle)
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                });
                res.send("Scrape Has Completed!");
                // res.render("index", "Scrape Has Completed!")
            })
    });
    
    app.get("/articles", function (req, res) {
        db.Article.find({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err)
            })
    });
    
    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("comment")
            .then(function (dbArticle) {
                res.json(dbArticle)
            })
            .catch(function (err) {
                res.json(err)
            })
    });
    
    app.post("/articles/:id", function (req, res) {
        db.Comment.create(req.body)
            .then(function (dbComment) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { comment: dbComment._id }}, { new: true })
            })
            .then(function (dbArticle) {
                res.json(dbArticle)
            })
            .catch(function (err) {
                res.json(err)
            })
    });
    
    app.put("/articles-saved/:id", function(req, res) {
        db.Article.findByIdAndUpdate(req.params.id, { $set: { saved: true }
        }).then(function(data) {
            res.json(data);
        })
        .catch(function(err){
            res.json(err)
        })
    });
    
    app.get("/display-saved/", function(req, res) {
        db.Article.find( 
            { saved: true }
        ).then(function(data) {
            res.json(data);
        });
    });
}