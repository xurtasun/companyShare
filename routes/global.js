/**
 * Created by urtasun on 19/10/15.
 */
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login/login', { title: 'Empresium' });
});
router.get('/indice', function(req, res, next) {
    var db = req.db;
    var collection = db.get('companies');
    collection.find({},{},function(e,docs){
        console.log(docs);
        res.render("indice/indice",{ empresas: docs });
    });
});


router.get('/register', function(req, res, next) {
    res.render('register/register', { title: 'Empresium' });
});

module.exports = router;
/*
 * GET userlist.
 */


/*
 * POST to adduser.
 */
router.post('/newcompany', function(req, res) {
    var db = req.db;
    var collection = db.get('companies');
    console.log(req.body);
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});
/*
 * DELETE to deleteuser.
 */
router.get('/deletecompany/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('companies');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
    });
    var collection = db.get('companies');
    collection.find({},{},function(e,docs){
        console.log(docs);
        res.render("indice/indice",{ empresas: docs });
    });
});
router.get('/update/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('companies');
    var userToUpdate = req.params.id;
    collection.findOne({"_id": userToUpdate},{},function(e,docs){
        console.log(docs);
        res.render("register/update",{ empresa: docs });
    });
});
router.post('/id/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('companies');
    var userToUpdate = req.params.id;
    console.log(req.body);
    var empresa = req.body;
    collection.update({"_id": userToUpdate},req.body,function(e,docs){
        console.log(docs);
    });
    collection.find({},{},function(e,docs){
        console.log(docs);
        res.render("indice/indice",{ empresas: docs });
    });
});


/*
 * POST to adduser.
 */
router.post('/login', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    console.log(req.body);
    var user = req.body;

    if (user.username=="admin" && user.password=="admin"){
        console.log("Bienvenido Administrador");

        var db = req.db;
        var collection = db.get('companies');
        collection.find({},{},function(e,docs){
            console.log(docs);
            res.render("indice/indice",{ empresas: docs });
        });
    }
});

module.exports = router;