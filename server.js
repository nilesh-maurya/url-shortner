"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
const dns = require("dns");
const Math = require("mathjs");

var cors = require("cors");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

const data = [];

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get("/api/shorturl/new", function(req, res) {
  dns.lookup(req.headers.host, function(err, address) {
    if (err) {
      res.json({ error: "invalid URL" });
    } else {
      const randint = getRandom(1, 100);
      // if(data.map(obj => obj.short_url === randint)){};
      data.push({ original_url: req.headers.host, short_url: randint });
      res.json({ original_url: req.headers.host, short_url: randint });
    }
  });
});

app.get("/api/shorturl/:num", function(req, res) {
  const num = req.params.num;
  const original_url = data.map(obj => {
    if (obj.short_url === num) {
      return obj.original_url;
    }
  });

  res.redirect(original_url);
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
