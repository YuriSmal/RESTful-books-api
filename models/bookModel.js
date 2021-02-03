const fs = require('fs').promises;

const getBookData = function ()  {
    return fs.readFile('/Users/ysmal/Desktop/ExpressBooksApp/public/books.json', 'utf8')
        .then(res => JSON.parse(res))
        .catch((err) => {
            console.log(err)
        });
}
const addBook = function (book) {
    return fs.readFile('/Users/ysmal/Desktop/ExpressBooksApp/public/books.json', 'utf8')
        .then((data) => {
            if (data === false) {
                let booksObj = {
                    books: []
                }
                booksObj.books.push(book);
                let bookJson = JSON.stringify(booksObj, null, 2);
                return fs.writeFile('/Users/ysmal/Desktop/ExpressBooksApp/public/books.json', bookJson, 'utf8')
                    .then(res => JSON.parse(res))
                    .catch(err => console.log({error: err}))
            } else {
                booksObj = JSON.parse(data);
                booksObj.books.push(book);
                bookJson = JSON.stringify(booksObj, null, 2);
                return fs.writeFile('/Users/ysmal/Desktop/ExpressBooksApp/public/books.json', bookJson, 'utf8')
                    .then(res => res)
                    .catch(err => console.log({error: err}))
            }
        })
}

const updateBooksInfo = function (res, book, result) {
    fs.writeFile('/Users/ysmal/Desktop/ExpressBooksApp/public/books.json', JSON.stringify(result, null, 2), 'utf8')
        .then((result) => res.send(result))
        .catch(() => res.status(422).send({error: 'Not found!'}))
}

exports.getBooks = function (title, author, page, limit) {
    return getBookData()
        .then((books) => {
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

exports.postBooks = function (res, title, author) {
    return getBookData()
        .then((result) => {
            let id = result.books[result.books.length - 1].id;
            let book = {
                title: title,
                author: author,
                id: ++id
            };

            if (title && title.length >= 2 && isNaN(title) && author && author.length >= 2 && isNaN(author)) {
                return addBook(book, (err) => {
                    if (err) {
                        console.log('Error!');
                    }
                })
                    .then(() => res.status(201).send(book))
            } else {
                res.status(422).send({error: "Not added!"});
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

}

exports.deleteBooks = function (res, id) {
    return getBookData()
        .then(result => {
            result.books.forEach(book => {
                if (book.id === id) {
                    result.books.splice(book.id - 1, 1);
                    return updateBooksInfo(res, book, result);
                }
            })
        })
}

