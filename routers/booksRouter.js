const booksController = require('../controllers/booksController');

module.exports = function appRouter(app) {
    app.get('/books', booksController.getBooks);
    app.post('/books', booksController.addBook);
    app.put('/books/:id', booksController.editBook);
    app.delete('/books/:id', booksController.deleteBook);
};