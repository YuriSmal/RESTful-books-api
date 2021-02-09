const booksController = require('../controllers/booksController');
const usersController = require('../controllers/usersController');

module.exports = function appRouter(app) {
    app.get('/books', usersController.tokenAuthentication, booksController.getBooks);
    app.post('/books', usersController.tokenAuthentication, booksController.addBook);
    app.post('/users', usersController.addUser);
    app.post('/token', usersController.refreshToken);
    app.post('/login', usersController.userLogin);
    app.delete('/logout', usersController.userLogout)
    app.put('/books/:id', usersController.tokenAuthentication, booksController.editBook);
    app.delete('/books/:id', usersController.tokenAuthentication, booksController.deleteBook);
};