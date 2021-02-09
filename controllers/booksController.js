const bookModel = require('../models/bookModel');
const validators = require('../validators/booksValidators');

exports.getBooks = function getBooks(req, res) {
    const author = req.query.author;
    const title = req.query.title;
    const page = req.query.page;
    const limit = req.query.limit;

    const validationResult = validators.validateBooksGetRequest(req);
    if (validationResult.isValid) {
        bookModel.getBooks(title, author, page, limit)
            .then((books) => {
                return  res.send(books);
            })
            .catch((err) => {
                res.send(err);
            })
    } else {
        return res.status(validationResult.status).send({error: validationResult.error});
    }
}

exports.addBook = function addBook(req, res) {
    const title = req.body.title;
    const author = req.body.author;

    const validationResult = validators.validateBooksPostRequest(req);
    if (validationResult.isValid) {
        bookModel.postBooks(res, title, author)
            .then(book => res.send(book))
            .catch(err => res.send(err))
    } else {
        return res.status(validationResult.status).send({error: validationResult.error});
    }
}

exports.editBook = function editBook(req, res) {
    const title = req.body.title;
    let id = Number(req.params.id);

    const validationResult = validators.validateBooksPutRequest(req);
    if (validationResult.isValid) {
        bookModel.editBooks(res, title, id)
            .then(result => {
                return res.send(result);
            })
            .catch(err => {
                res.send(err);
            })
    } else {
        return res.status(validationResult.status).send({error: validationResult.error});
    }
}

exports.deleteBook = function deleteBook(req, res) {
    let id = Number(req.params.id);

    const validationResult = validators.validateBooksDeleteRequest(req);
    if (validationResult.isValid) {
        return bookModel.deleteBooks(res, id)
            .then(result => {
                return res.send(result);
            })
            .catch(err => {
                res.send(err)
            })
    } else {
        return res.status(validationResult.status).send({error: validationResult.error});
    }
}




