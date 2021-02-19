const fs = require('fs').promises;

const getBookData = function ()  {
    return fs.readFile('./database/books.json', 'utf8')
        .then(res => JSON.parse(res))
        .catch((err) => {
            console.log(err)
        });
}

exports.getBookData = getBookData;

const addBook = function (book) {
    return fs.readFile('./database/books.json', 'utf8')
        .then((data) => {
            if (data === false) {
                let booksObj = {
                    books: []
                }
                booksObj.books.push(book);
                let bookJson = JSON.stringify(booksObj, null, 2);
                return fs.writeFile('./database/books.json', bookJson, 'utf8')
                    .then(res => JSON.parse(res))
                    .catch(err => console.log({error: err}))
            } else {
                let booksObj = JSON.parse(data);
                booksObj.books.push(book);
                let bookJson = JSON.stringify(booksObj, null, 2);
                return fs.writeFile('./database/books.json', bookJson, 'utf8')
                    .then(result => result)
                    .catch(err => console.log({error: err}))
            }
        })
}

const updateBooksInfo = function (res, book, result) {
    fs.writeFile('./database/books.json', JSON.stringify(result, null, 2), 'utf8')
        .then(() => (book))
        .catch(() => ({error: 'Not found!'}))
}

exports.getBooks = function (title, author, page, limit) {
    return getBookData()
        .then(books => {
            let result = [];
            if (title || author) {
                books.books.forEach(item => {
                    if (item.title === title || item.author === author) {
                        result.push(item);
                    }
                })
            } else {
                result = books;
            }

            if (page && limit) {
                result = books.books.slice((page - 1) * limit, page * limit)
            }
            return result;
        })
}

exports.postBooks = function (res, title, author, pages) {
    return getBookData()
        .then(result => {
            let id = result.books.length > 0 && result.books[result.books.length - 1].id;
            let book = {
                title: title,
                author: author,
                id: ++id,
                pages: pages
            };

            if (title && title.length >= 2 && isNaN(title) && author && author.length >= 2 && isNaN(author)
               && pages && Number.isInteger(pages)) {
                return addBook(book, (err) => {
                    if (err) {
                        console.log('Error!');
                    }
                })
                    .then(result => (book))
            } else {
                 return ({error: "Not added!"});
            }
        })
}

exports.editBooks = function (res, title, id) {
    return getBookData()
        .then(result => {
            result.books.forEach(book => {
                if (book.id === id) {
                    book.title = title;
                    return updateBooksInfo(res, book, result)
                }
            })
        })
        .then(() => ({message: `The title has been changed`}))
}

exports.deleteBooks = function (res, id) {
    return getBookData()
        .then(result => {
            result.books.forEach(book => {
                if (book.id === id) {
                    result.books.splice(book.id - 1, 1);
                    return updateBooksInfo(res, book, result)
                }
            })
        })
        .then(() => ({message: `The book with id ${id} has been deleted`}))

}

