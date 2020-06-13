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
})

//Stores a unique object of type express in the variable app
let app = express();

//Allows us to use objects and arrays like JSON format
app.use(bodyParser.urlencoded({extended: true}));


//Use this variable for our port communication
let port = 3000;

//Specifies how html will by seen by setting the view engine as ejs
app.set("view engine", "ejs");

//Get route for the root directory
app.get("/", function(req,res){
    knex.select("SongID", "SongName", "ArtistID", "YearReleased").from("Songs").orderBy("SongID").then(function(songInfo){
        res.render("index", {importantInfo: songInfo});
    }).catch(function(err){
        console.log(err);
        res.status(500).json({err});
    });
});

app.post("/DeleteRecord/:id", function(req,res){
    knex("Songs").where("SongID", req.params.id).del().then(function(importantInfo){
        res.redirect("/");
    }).catch(function(err){
        console.log(err);
        res.status(500).json({err});
    });
});

app.get("/addRecord", function(req, res){
    res.render("addRecord");
});

app.post("/addRecord", function(req, res){
    knex("Songs").insert(req.body).then(function(importantInfo){
        res.redirect("/");
    });
});

app.post("/updateRecord/:id", function (req, res){
    res.render("updateRecord");
});

app.post("/updateRecord", function (req, res){
    knex("Songs").where({SongID: req.body.SongID}).update({
        SongName: req.body.SongName, ArtistID: req.body.ArtistID, YearReleased: req.body.YearReleased
    }).then(function (importantInfo){
        res.redirect("/");
    });
});

app.get("/batch", function (req, res){
    knex("Songs").insert(
    [
        {SongName: "I See Fire", ArtistID: "Ed Sheeran", YearReleased: "2015"},
        {SongName: "Don't Stop Believing", ArtistID: "Journey", YearReleased: "1989"},
        {SongName: "The Shire", ArtistID: "Howard Shore", YearReleased: "2002"},
        {SongName: "The Last Goodbye", ArtistID: "LotR", YearReleased: "2017"}
    ]
    ).then(importantInfo => {
        res.redirect("/");
    });
});


//Listening method for port 3000 that keeps running after it is first executed
app.listen(port, function(){
    //Now explain what function operations execute on port 3000
    console.log("I am now listening");
})