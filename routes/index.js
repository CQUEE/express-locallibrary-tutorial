var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.redirect("/catalog");
});

router.get('/users/cool/', function(req, res, next) {
  res.send('You are so cool');
});

module.exports = router;
