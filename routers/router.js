const booksController = require('../controllers/booksController');
const usersController = require('../controllers/usersController');
const userBooksController = require('../controllers/userBooksController');

module.exports = function appRouter(app) {
    app.get('/books', usersController.tokenAuthentication, booksController.getBooks);
    app.post('/books', usersController.tokenAuthentication, usersController.authRole("admin"), booksController.addBook);
    app.post('/users', usersController.addUser);
    app.post('/token', usersController.refreshToken);
    app.post('/login', usersController.userLogin);
    app.delete('/logout',  usersController.userLogout);
    app.put('/books/:id', usersController.tokenAuthentication, usersController.authRole("admin"), booksController.editBook);
    app.delete('/books/:id', usersController.tokenAuthentication, usersController.authRole("admin"), booksController.deleteBook);
    app.get('/users/:id/books', usersController.tokenAuthentication,  userBooksController.getUserLibrary);
    app.post('/users/:user_id/books/:book_id', usersController.tokenAuthentication, userBooksController.addBookToLibrary);
    app.put('/users/:user_id/books/:book_id', usersController.tokenAuthentication, userBooksController.updateReadStatus);
    app.delete('/users/:user_id/books/:book_id', usersController.tokenAuthentication, userBooksController.deleteBookFromLibrary);
};