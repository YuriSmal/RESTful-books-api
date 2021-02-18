const fs = require('fs').promises;
const bookModel = require('./bookModel');
const usersModel = require('./usersModel');

const getBooksData = function()  {
    return fs.readFile('/Users/ysmal/Desktop/ExpressBooksApp/database/booksLibrary.json', 'utf8')
        .then(res => JSON.parse(res))
        .catch(err => ({error: err}))
}

exports.getBooksData = getBooksData;

exports.getUserLibrary = function(id) {
    return getBooksData()
        .then(result => {
            let filteredBooks = result.booksLibrary.filter(book => book.addedByUserId === id);
            return filteredBooks;
        })
}

const addBook = function(bookToAdd) {
    return fs.readFile('/Users/ysmal/Desktop/ExpressBooksApp/database/booksLibrary.json', 'utf8')
        .then((data) => {
            if (data === false) {
                let booksObj = {
                    booksLibrary: []
                }
                booksObj.booksLibrary.push(bookToAdd);
                let booksJson = JSON.stringify(booksObj, null, 2);
                return fs.writeFile('/Users/ysmal/Desktop/ExpressBooksApp/database/booksLibrary.json', booksJson, 'utf8')
                    .then(result => JSON.parse(result))
                    .catch(err => ({error: err}))
            } else {
                let booksObj = JSON.parse(data);
                if(booksObj.booksLibrary.find(book => book.title === bookToAdd.title)
                && booksObj.booksLibrary.find(book => book.addedByUserId === bookToAdd.addedByUserId)) {
                    return ({message: "Already added!"})
                }
                booksObj.booksLibrary.push(bookToAdd);
                let booksJson = JSON.stringify(booksObj, null, 2);
                return fs.writeFile('/Users/ysmal/Desktop/ExpressBooksApp/database/booksLibrary.json', booksJson, 'utf8')
                    .then(result => (bookToAdd))
                    .catch(err => ({error: err}))
            }
        })
}

exports.addBookToLibrary = function(req, user_id, book_id) {
    return bookModel.getBookData()
        .then(result => {
            return usersModel.getUsersData()
                .then(users => {
                    let bookToAdd = result.books.find(book => book.id === book_id);
                    if (!bookToAdd) return ({error: "The book does not exist!"})
                    let user = users.users.find(user => user.id === user_id);
                    bookToAdd.addedByUserId = user.id;
                    bookToAdd.currentPage = 1;
                    bookToAdd.isReadingCompleted = false;

                    return addBook(bookToAdd, err => {
                        if (err) {
                            return ({error: err})
                        }
                    })
                        .then(result => result)
                })
        })
}

exports.updateReadStatus = function(req, bookId, userId, currentPage) {
    return getBooksData()
        .then(result => {
                    let bookToEdit = result.booksLibrary.find(book => {
                        if (book.addedByUserId === userId && book.id === bookId) {
                            return book;
                        }
                    });
                    if (!bookToEdit) return ({error: "The book does not exist!"});
                    if (currentPage && currentPage >= 1) {
                        bookToEdit.currentPage = currentPage;
                        if (bookToEdit.currentPage > bookToEdit.pages) {
                            return ({error: "The book has less pages than you've read. You are probably lying :)"})
                        } else if (bookToEdit.currentPage === bookToEdit.pages) {
                            bookToEdit.isReadingCompleted = true;
                        }
                        return fs.writeFile('/Users/ysmal/Desktop/ExpressBooksApp/database/booksLibrary.json', JSON.stringify(result, null, 2), 'utf8')
                            .then(() => ({message: "Your reading status has been updated."}))
                            .catch(err => ({error: err}))
                    } else {
                        return ({error: "Incorrect value entered!"})
                    }
        })
}

exports.deleteBookFromLibrary = function (req, userId, bookId) {
    return getBooksData()
        .then(result => {
            result.booksLibrary.forEach(book => {
                if (book.id === bookId && book.addedByUserId === userId) {
                    result.booksLibrary.splice(result.booksLibrary.indexOf(book), 1);
                }
            })
            return fs.writeFile('/Users/ysmal/Desktop/ExpressBooksApp/database/booksLibrary.json', JSON.stringify(result, null, 2), 'utf8')
                .then(() => (result))
                .catch(err => ({error: err}))
        })
}
