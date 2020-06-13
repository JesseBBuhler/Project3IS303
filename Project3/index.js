let express = require("express");
let app = express();
let path = require("path");
let bodyParser = require("body-parser");
let knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./MusicLibrary.db"
    },
    useNullAsDefault: true
})

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    knex.select('*').from("Songs").orderBy("SongID").then(songs =>{
        res.render("index", {songs: songs});
    }).catch(err =>{
        console.log(err);
        res.status(500).json({err});
    });
});

app.post("/DeleteSong/:id", (req, res) => {
    knex("Songs").where("SongID", req.params.id).del().then(songs => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.get("/AddSong", (req, res) => {
    res.render("AddSong");
})

app.post("/AddSong", (req, res) => {
    knex('Songs').insert(req.body).then(songs => {
        res.redirect("/");
    });
});

app.get("/EditSong", (req, res) => {
    res.render("EditSong");
})

app.post("/EditSong", (req, res) => {
    knex("Songs").where({SongID: req.body.SongID}).update({
        SongName: req.body.SongName, ArtistID: req.body.ArtistID,
        YearReleased: req.body.YearReleased}).then(songs => { 
        res.redirect("/");
    });
});

app.get("/Cancel", (req, res) => {
    res.render("index.ejs");
});

app.get("/", function(req, res){
    res.render("index");
})

app.post("/StartOver", (req,res) => {
    knex("Songs").whereNotNull("SongID").del().then(songs => {knex("Songs").insert(
        [
            {SongName: "Bohemian Rhapsody", ArtistID: "QUEEN", YearReleased: "1975"},
            {SongName: "Dont Stop Believing", ArtistID: "JOURNEY", YearReleased: "1981"},
            {SongName: "Hey Jude", ArtistID: "BEATLES", YearReleased: "1968"}
        ]).then(songs => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
        });
    });
});

/*app.get("/editsong", function(req, res){
    res.sendfile(path.join(__dirname + "/views/editsong.ejs"));
})

app.get("/addsong", function(req, res){
    res.sendfile(path.join(__dirname + "/views/addsong.ejs"));
})*/

app.listen(3000, function(){
    console.log("I am now listening");
})