var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/books', function(req, res, next) {
  knex('library')
    .select('books.id', 'title', 'first_name', 'last_name', 'genre', 'description', 'cover_url')
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

router.get('/books/add', function(req, res, next) {
    res.render('addbook', { page_title: ': Add Book' });
});

router.post('/books/add', function(req, res, next) {
  knex('books').insert({ title: req.body.title, cover_url: req.body.cover_url, genre: req.body.genre, description: req.body.description }).returning('id').then(function(bookId) {
    knex('authors').insert({ first_name: req.body.first_name, last_name: req.body.last_name }).returning('id').then(function(authorId) {
      knex('library').insert({ book_id: bookId[0], author_id: authorId[0] }).then(function() {
        res.redirect('/books');
      })
    })
  })
});

router.get('/books/delete/:id', function(req, res, next) {
  knex('books').where('id', req.params.id).del().then(function() {
    res.redirect('/books');
  });
});

module.exports = router;
