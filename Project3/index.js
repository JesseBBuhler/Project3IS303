/*
Project 3
Section 002
Team 1

Shannon Murray
Joshua Card
Jesse Brayden Buhler
Jarod Jones
Zachary Sterling
Brita Szymanski

This program displays information from a database of songs. The each row can be edited and/or deleted. 
When editing a row in the database the user is redirected to another page, the info from that row automatically 
populates into the fields on the edit song page, and then the user can make their changes and submit them. 
There is an add button that allows the user to add new songs into the database, and there is also a button to start over, 
which deletes everything in the table and then adds back in the original three songs that were in the database. 
When the user submits any changes, additions, or deletes a file, they are redirected back to the main page.

This file is the main file indicated in the package.json file; it gives the program access to the necessary modules, 
sets up the port, connects to the Songs database, and provides instructions for each route used throughout the program.
*/

//Give program access to the express library
let express = require("express");
//Creates variable so we can access/use express
let app = express();

//Give program access to knex module
//Uses sqlite3 to get access to musiclibrary database
let knex = require("knex")({
    client:'sqlite3',
    connection: {
        filename:"./musiclibrary.db"
    },
    useNullAsDefault: true
});

//Gives program access to body-parser library
let bodyParser = require("body-parser");
//Allows us to use objects/arrays like json
app.use(bodyParser.urlencoded({extended: true}));

//Create path to root directory (not necessary for this assignment)
let path = require("path");

//Turns ejs into html and helps browser display
app.set("view engine", "ejs");

//Listens for requests on port 3000
app.listen(3000, (req, res) => {
    console.log("I am now listening");
});

//When the root directory is requested, pull the data from Songs, order by SongID
//Then send that data to the songs var, which transfers the data to the tunes var for use
//on the index.ejs page it then renders
app.get("/", (req, res) => {
    knex.select("SongID", "SongName", "ArtistID", "YearReleased").from("Songs")
    .orderBy("SongID").then(songs => {
        res.render("index", {tunes : songs});
    });
});

//Removes record from the database where the SongID matches the param id
app.post("/DeleteSong/:id", (req, res) => {
    knex("Songs").where("SongID", req.params.id).del().then(() => {
        res.redirect("/");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

//Gets the record from Songs where the SongID matches the id param 
//then renders the editsong.ejs with the record data stored in songs
app.get("/EditSong/:id", (req, res) => {
    knex("Songs").where("SongID", req.params.id).then(songs => {
        res.render("editsong", {songs : songs});
    });
});
//Updates song record where SongID matches the id param and updates the attributes
app.post("/EditSong/:id", (req, res) => {
    knex("Songs").where("SongID", req.params.id).update({
        SongName: req.body.SongName, ArtistID: req.body.ArtistID, YearReleased: req.body.YearReleased
    }).then(() => {
        res.redirect("/");
    });
});

//Redirects user to index.ejs 
app.post("/cancel", (req, res) => {
    res.redirect("/");
});


//Takes user to the add song page when request is recieved
app.get("/AddSong", (req, res) => {
    res.render("addsong");
});
//Adds inputs from the user to the songs database and return to index.ejs
app.post("/AddSong", (req, res) => {
    knex("Songs").insert(req.body).then(() => {
        res.redirect("/");
    });
});

//Clears all song records
//Then inserts 3 hard-coded sets of attributes as records to the Songs database before redirecting
app.get("/StartOver", (req, res) => {
    knex("Songs").del().then(() => {
        knex("Songs").insert(
            [
                {SongName: "Bohemian Rhapsody", ArtistID: "QUEEN", YearReleased: 1975},
                {SongName: "Don't Stop Believing", ArtistID: "JOURNEY", YearReleased: 1981},
                {SongName: "Hey Jude", ArtistID: "BEATLES", YearReleased: 1968}
            ]
        ).then(() => {
            res.redirect("/");
        });
    });
});


