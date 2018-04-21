const express = require('express');
const app = express();

const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/mydb";

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.result = [];

app.listen(8085, function () {
    console.log('nasluchuje na 8085');
});

MongoClient.connect(url, (err, db) => {
    if (err) throw err;

    var dbo = db.db("mydb");
    dbo.createCollection("wiadomosci", (err, res) => {
        if (err) throw err;
        console.log("Kolekcja utworzona");
    });

    db.close();
});

app.get('/', (req, resp) => {
    try {
        MongoClient.connect(url, (err, db) => {
            var dbo = db.db("mydb");

            dbo.collection("wiadomosci").find().toArray((err, result) => {
                if (err) throw err;
                db.close();

                resp.render('index.ejs', { wiadomosci: result });
            });
        })
    } catch (e) {
        resp.render('index.ejs', { wiadomosci: app.result });
    }
});

app.get('/kasuj/:id', (req, resp) => {
    MongoClient.connect(url, (err, db) => {
        var dbo = db.db("mydb");

        dbo.collection('wiadomosci').deleteOne({ _id: ObjectId(req.params.id)}, (err, res) => {
            if (err) throw err;
            db.close();

            console.log("Rekord usunietey: " + req.params.id);
            resp.redirect('/');
        });
    })
});

app.post('/wiadomosci', (req, resp) => {
    var nowaWiadomosc = {
        "imie": "" + req.body.imie + "",
        "nazwisko": "" + req.body.nazwisko + "",
        "wiadomosc": "" + req.body.wiadomosc + ""
    };

    MongoClient.connect(url, (err, db) => {
        var dbo = db.db("mydb");

        dbo.collection('wiadomosci').insertOne(nowaWiadomosc, (err, res) => {
            if (err) throw err;
            db.close();

            console.log("Rekord wstawiony");
            resp.redirect('/');
        });
    })
})
