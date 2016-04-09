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

router.get('/books/add', function(req, res, next) {
    res.render('addbook', { page_title: ': Add Book' });
});

router.get('/books/delete/:id', function(req, res, next) {
  knex('books').where('id', req.params.id).del().then(function() {
    res.redirect('/books');
  });
});

router.get('/books/:id', function(req, res, next) {
  knex('books').where({ id: req.params.id }).first().then(function(book) {
    knex('library')
      .join('authors', 'authors.id', 'library.author_id')
      .select('first_name', 'last_name')
      .where({ book_id: book.id })
      .then(function (authors) {
        var authorsObj = {};
        for (var i = 0; i < authors.length; ++i) {
          authorsObj[i] = authors[i];
        }
        res.render('book', { page_title: ': Book', book: book, authors: authorsObj });
      })
  })
});

router.get('/authors', function(req, res, next) {
  knex('library')
    .select('authors.id', 'title', 'first_name', 'last_name', 'biography', 'portrait_url')
    .join('books', 'books.id', 'library.book_id')
    .join('authors', 'authors.id', 'library.author_id')
    .then(function (library) {
      res.render('authors', { page_title: ': Authors', library: library });
    })
});

router.get('/authors/add', function(req, res, next) {
    res.render('addauthor', { page_title: ': Add Author' });
});

router.get('/authors/delete/:id', function(req, res, next) {
  knex('authors').where('id', req.params.id).del().then(function() {
    res.redirect('/authors');
  });
});

router.get('/all', function(req, res, next) {
  knex('library')
    .join('books', 'books.id', 'library.book_id')
    .join('authors', 'authors.id', 'library.author_id')
    .then(function(all) {
      res.render('all', { page_title: ': All', library: all });
    })
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

router.post('/authors/add', function(req, res, next) {
  knex('authors').insert({ first_name: req.body.first_name, last_name: req.body.last_name, portrait_url: req.body.portrait_url, biography: req.body.biography }).returning('id').then(function(authorId) {
    knex('books').insert({ title: req.body.title }).returning('id').then(function(bookId) {
      knex('library').insert({ book_id: bookId[0], author_id: authorId[0] }).then(function() {
        res.redirect('/authors');
      })
    })
  })
});

module.exports = router;
