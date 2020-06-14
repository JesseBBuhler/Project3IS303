//Bring in different libraries
    //Brings in Express library, which is a node framework that simplifies http requests and routes and other things
    let express = require("express");

    //Brings in the path module
    let path = require("path");

    //Brings in body-Parser library used in the req extracting data from the request or form
    let bodyParser = require("body-parser");

    //Gives access to the knex library, which provides SQL in our app
    let knex = require("knex")({
        client: "sqlite3",
        connection: {
            filename: "./MusicLibrary.db"
        },
        useNullAsDefault: true
    });

//Set up variables
    //Stores a unique object of type express in the variable app
    let app = express();

    //Allows us to use objects and arrays like JSON format
    app.use(bodyParser.urlencoded({extended: true}));


    //Use this variable for our port communication
    let port = 3000;

    //Specifies how html will by seen by setting the view engine as ejs
    app.set("view engine", "ejs");

//Page Directing and Commands
//Get route for the root directory
    app.get("/", function(req,res){
        knex.select("SongID", "SongName", "ArtistID", "YearReleased").from("Songs").orderBy("SongID").then(function(songInfo){
            res.render("index", {importantInfo: songInfo});
        }).catch(function(err){
            console.log(err);
            res.status(500).json({err});
        });
    });

//Delete
    app.post("/DeleteSong/:id", function(req,res){
        knex("Songs").where("SongID", req.params.id).del().then(function(importantInfo){
            res.redirect("/");
        }).catch(function(err){
            console.log(err);
            res.status(500).json({err});
        });
    });

//Add
    app.get("/AddSong", function(req, res){
        res.render("AddSong");
    });

    app.post("/AddSong", function(req, res){
        console.log(req.body.ArtistID);
        req.body.ArtistID = req.body.ArtistID.toUpperCase();
        knex("Songs").insert(req.body).then(function(importantInfo){
            res.redirect("/");
        });
    });

    //If you don't want the ArtistID value to be capitalized
    /*app.post("/AddSong", function(req, res){
        knex("Songs").insert(req.body).then(function(importantInfo){
            res.redirect("/");
        });
    });*/

    app.post("/AddSong/Cancel", function(req, res){
        res.redirect("/");
    });

//Edit
    app.get("/EditSong/:id", function (req, res){
        knex.select("SongID","SongName","ArtistID","YearReleased").from("Songs").where("SongID", req.params.id).then(importantInfo => {
            res.render("EditSong", {importantInfo: importantInfo});
        });
    });

    app.post("/EditSong/:id", function (req, res){
        knex("Songs").where({SongID: req.body.SongID}).update({
            SongName: req.body.SongName, ArtistID: req.body.ArtistID.toUpperCase(), YearReleased: req.body.YearReleased
        }).then(function (importantInfo){
            res.redirect("/");
        });
    });

    app.post("/EditSong/:id/Cancel", function (req, res){
        res.redirect("/");
    });

//Start Over
    app.post("/StartOver", function(req, res){
        knex.select("SongID","SongName","ArtistID","YearReleased").from("Songs").del().then(function(){
            knex("Songs").insert(
                [
                    {SongName: "Bohemian Rhapsody", ArtistID: "QUEEN", YearReleased: "1975"},
                    {SongName: "Don't Stop Believing", ArtistID: "JOURNEY", YearReleased: "1981"},
                    {SongName: "Hey Jude", ArtistID: "BEATLES", YearReleased: "1968"}
                ]
            ).then(function(){
                res.redirect("/");
            });
        });
    });

//Listening
    //Listening method for port 3000 that keeps running after it is first executed
    app.listen(port, function(){
        //Now explain what function operations execute on port 3000
        console.log("I am now listening");
    });