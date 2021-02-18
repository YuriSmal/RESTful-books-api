const userBooksModel = require('../models/userBooksModel');
const validators = require('../validators/userBooksValidators');

exports.getUserLibrary = function getUserLibrary(req, res) {
    const id = Number(req.params.id);

    const validationResult = validators.validateGetUserLibraryRequest(req);
    if(validationResult.isValid) {
        return userBooksModel.getUserLibrary(id)
            .then(result => res.send(result))
            .catch(err => res.send(err))
    } else {
        return res.status(validationResult.status).send({error: validationResult.error})
    }

}

exports.addBookToLibrary = function addBookToLibrary(req, res) {
    const user_id = Number(req.params.user_id);
    const book_id = Number(req.params.book_id);

    const validationResult = validators.validateAddBookRequest(req);
    if (validationResult.isValid) {
        return userBooksModel.addBookToLibrary(req, user_id, book_id)
            .then(result => res.status(201).send(result))
            .catch(err => res.send(err))
    } else {
        return res.status(validationResult.status).send({error: validationResult.error})

    }
}

exports.updateReadStatus = function updateReadStatus(req, res) {
    const userId = Number(req.params.user_id);
    const bookId = Number(req.params.book_id);
    const currentPage = Number(req.body.currentPage);

    const validationResult = validators.validateUpdateReadStatusRequest(req);
    if (validationResult.isValid) {
        return userBooksModel.updateReadStatus(req, bookId, userId, currentPage)
            .then(result => res.status(201).send(result))
            .catch(err => res.send(err))
    } else {
        return res.status(validationResult.status).send({error: validationResult.error})
    }
}

exports.deleteBookFromLibrary = function deleteBookFromLibrary(req, res) {
    const userId = Number(req.params.user_id);
    const bookId = Number(req.params.book_id);

    const validationResult = validators.validateDeleteBookRequest(req);
    if (validationResult.isValid) {
        return userBooksModel.deleteBookFromLibrary(req, userId, bookId)
            .then(result => res.status(200).send(result))
            .catch(err => res.send(err))
    } else {
        return res.status(validationResult.status).send({error: validationResult.error})
    }
}
