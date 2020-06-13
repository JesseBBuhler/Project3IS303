const port = 3001;
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const knex = require("knex") ({
    client: "sqlite3",
    connection: {
        filename: "MusicLibrary.db" 
    },
    useNullAsDefault: true  
});


app.listen(port, () => {
console.log("Started server at port " + port);
});


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    knex.select("*").from("Songs").orderBy("SongName").then(song =>{ 
        res.render("index", {song: song} );
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
});

app.post('/DeleteSong/:id', (req, res) => {
    knex('Songs').where('SongID',req.params.id).del().then(song => {
        res.redirect('/');
    })
});

app.get('/AddSong', (req,res) => {
    res.render('addsong');
});

app.post('/AddSong', (req, res) => { 
    console.log(req.body);
    knex('Songs').insert(req.body).then(song => {
        res.redirect('/');
    });
});

app.get('/EditSong/:SongID', (req, res) => {
    res.render('editsong', {id: req.params.SongID});
});

app.post('/EditSong/:SongID', (req, res) => {
    knex('Songs').where({ SongID: req.params.SongID }).update({
        SongName: req.body.SongName, ArtistID: req.body.ArtistID, 
        YearReleased: req.body.YearReleased }).then(song => {
            res.redirect('/');
        });  
});

app.post('/StartOver', (req, res) => {
        knex('Songs').where(true).del().then(
            res.redirect('SetUp'));
});

app.get('/SetUp', (req, res) => {
    knex('Songs').insert([
        {SongName: "Bohemian Rhapsody", ArtistID: "QUEEN", YearReleased: "1975"},
        {SongName: "Don't Stop Believing", ArtistID: "JOURNEY", YearReleased: "1981"},
        {SongName: "Hey Jude", ArtistID: "BEATLES", YearReleased: "1968"}
    ]).then(song => {
            res.redirect('/');
        });  
});


