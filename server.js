"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
const dns = require("dns");
const crypto = require('crypto');

var cors = require("cors");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true});

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});


// mongooose model
const Urldb = mongoose.model('Urldb', {
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: String
  }
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/new", function(req, res) {
  dns.lookup(req.headers.host, function(err, address) {
    if (err) {
      res.json({ error: "invalid URL" });
    } else {
      crypto.randomBytes(8, (err, buf) => {
        if(err) throw err;
        const hash = buf.toString('Hex');
        Urldb.insert({original_url: req.headers.host, short_url: hash}, function(err, data){
          res.json({ original_url: data.original_url, short_url: data.hash });
        });
      });
    }
  });
});

app.get("/api/shorturl/:hash", function(req, res) {
  const hash = req.params.hash;
  Urldb.find({short_url: hash}, function(err, data){
    res.redirect(data.original_url);
  });
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
