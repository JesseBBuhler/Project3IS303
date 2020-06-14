let express = require("express");
let app = express();
let path = require("path");
let port = 3000;
let bodyParser = require("body-parser");
let knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "MusicLibrary.db"
    },
    useNullAsDefault: true
});
app.listen(port, function(){
    console.log("I'm listening")
})

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    knex.select("SongID","SongName","ArtistID","YearReleased").from("Songs").orderBy("SongID").then(song =>{ 
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

app.get("/addSong", (req,  res) => {
    res.render("addSong");
})

app.post("/addSong", (req, res) =>{
    knex("Songs").insert(req.body).then(song => {
        res.redirect("/");
    })
})

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


