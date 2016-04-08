var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/books', function(req, res, next) {
  knex('library')
    .select('title', 'first_name', 'last_name', 'genre', 'description', 'cover_url')
    .join('books', 'books.id', 'library.book_id')
    .join('authors', 'authors.id', 'library.author_id')
    .then(function (library) {
      res.render('books', { page_title: ': Books', library: library });
    })
});

router.get('/all', function(req, res, next) {
  knex('library')
    .join('books', 'books.id', 'library.book_id')
    .join('authors', 'authors.id', 'library.author_id')
    .then(function(all) {
      res.render('all', { page_title: ': All', library: all });
    })
});

module.exports = router;
