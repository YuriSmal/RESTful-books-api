const sessionsDb = require('../../database/test/sessions.json');
const fs = require('fs').promises;

exports.setSessionEnv = () => {
    const environment = process.env.NODE_ENV;
    let path;
    if(environment === 'test') {
        path = './database/test/sessions.json';
        return path;
    } else {
        path = './sessions/sessions.json';
        return path;
    }
}

exports.setUsersEnv = () => {
    const environment = process.env.NODE_ENV;
    let path;
    if(environment === 'test') {
        path = './database/test/users.json';
        return path;
    } else {
        path = './database/users.json';
        return path;
    }
}

exports.setBooksEnv = () => {
    const environment = process.env.NODE_ENV;
    let path;
    if(environment === 'test') {
        path = './database/test/books.json';
        return path;
    } else {
        path = './database/books.json';
        return path;
    }
}

exports.setUserBooksEnv = () => {
    const environment = process.env.NODE_ENV;
    let path;
    if(environment === 'test') {
        path = './database/test/booksLibrary.json';
        return path;
    } else {
        path = './database/booksLibrary.json';
        return path;
    }
}


exports.resetSessionsDb = () => {
   return fs.readFile('./database/test/sessions.json', 'utf8')
        .then(result => {
            let sessionDbObj = JSON.parse(result);
            sessionDbObj.loggedUsers = [];
            sessionDbObj.refreshTokens = [];
            let sessionDbJson = JSON.stringify(sessionDbObj, null, 2);
            fs.writeFile('./database/test/sessions.json', sessionDbJson, 'utf8')
                .then(result => result)
                .catch(err => console.log(err))
        })
}

exports.resetBooksDb = () => {
    return fs.readFile('./database/test/books.json', 'utf8')
        .then(result => {
            let sessionDbObj = JSON.parse(result);
            sessionDbObj.books = [{title: 'book1', author: 'someone1', id: 1, pages: 100}];
            let sessionDbJson = JSON.stringify(sessionDbObj, null, 2);
            fs.writeFile('./database/test/books.json', sessionDbJson, 'utf8')
                .then(result => result)
                .catch(err => console.log(err))
        })
}

exports.resetBooksLibraryDb = () => {
    return fs.readFile('./database/test/booksLibrary.json', 'utf8')
        .then(result => {
            let sessionDbObj = JSON.parse(result);
            sessionDbObj.booksLibrary = [];
            let sessionDbJson = JSON.stringify(sessionDbObj, null, 2);
            fs.writeFile('./database/test/booksLibrary.json', sessionDbJson, 'utf8')
                .then(result => result)
                .catch(err => console.log(err))
        })
}

exports.setBooksLibraryDb = () => {
    return fs.readFile('./database/test/booksLibrary.json', 'utf8')
        .then(result => {
            let sessionDbObj = JSON.parse(result);
            sessionDbObj.booksLibrary = [{
                title: "book1",
                author: "someone1",
                id: 1,
                pages: 100,
                addedByUserId: 2,
                currentPage: 1,
                isReadingCompleted: false
            }];
            let sessionDbJson = JSON.stringify(sessionDbObj, null, 2);
            fs.writeFile('./database/test/booksLibrary.json', sessionDbJson, 'utf8')
                .then(result => result)
                .catch(err => console.log(err))
        })
}
