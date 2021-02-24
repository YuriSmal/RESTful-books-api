const booksApiHelper = require('../helpers/booksApiHelper');
const frisby = require('frisby');

describe('Books REST api', () => {
    const baseUrl = 'http://localhost:8000';

    describe('GET /books', () => {
        let accessToken = null;
        beforeEach(done => {
            booksApiHelper.resetSessionsDb()
                .then(() => {
                    frisby
                        .post(baseUrl + '/login', {body: {name: 'Yurii', password: '1234567890'}})
                        .then(response => {
                            accessToken = response.json.accessToken;
                            done()
                        });
                })
        })
        afterEach(done => {
            booksApiHelper.resetSessionsDb()
                .then(() => {
                    done()
                })
        })
        it('should return all books info', function (done) {
                    frisby
                        .setup({
                            request: {
                                headers: {
                                    'Authorization': 'Bearer ' + accessToken
                                }
                            }
                        })
                        .get(baseUrl + '/books')
                        .then(response => {
                            expect(response.status).toBe(200);
                            expect(response.json.books[0].title).toBe('book1');
                            expect(response.json.books[0].author).toBe('someone1');
                            expect(response.json.books[0].id).toBe(1);
                            expect(response.json.books[0].pages).toBe(100);
                        })
                        .done(done)
                })
        });

    describe('POST /login', () => {
        it('should return successfully logged in message', function (done) {
            return frisby
                .post(baseUrl + '/login', {body: {name: 'Yurii', password: '1234567890'}})
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.json.message).toBe('Successfully logged in');
                })
                .done(done)
        });
    });

    describe('POST /books', () => {
        let accessToken = null;
        beforeEach(done => {
                booksApiHelper.resetBooksDb()
                    .then(() => {
                        frisby
                            .post(baseUrl + '/login', {body: {name: 'Yurii', password: '1234567890'}})
                            .then(response => {
                                accessToken = response.json.accessToken;
                                done()
                            });
                    })
        })
        it('should return the added book ', function (done) {
            frisby
                .setup({
                    request: {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }
                })
                .post(baseUrl + '/books', {title: "book2", author: "someone2", pages: 200})
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.json.title).toBe('book2');
                    expect(response.json.author).toBe('someone2');
                    expect(response.json.id).toBe(2);
                    expect(response.json.pages).toBe(200);
                })
                .done(done)
        });
    });
    
    describe('POST /users', () => {
        it('should return added user data', function (done) {
            frisby
                .post(baseUrl + '/users', {name: "John", "password": "123456789"})
                .then(response => {
                    expect(response.status).toBe(202);
                    expect(response.json.name).toBe('John');
                })
                .done(done)
        });
    });
    
    describe('POST /token', () => {
        let accessToken = null;
        let refreshToken = null;
        beforeEach(done => {
            booksApiHelper.resetSessionsDb()
                .then(() => {
                    frisby
                        .post(baseUrl + '/login', {body: {name: 'Yurii', password: '1234567890'}})
                        .then(response => {
                            accessToken = response.json.accessToken;
                            refreshToken = response.json.refreshToken;
                            done()
                        });
                })
        })
        it('should return 201 status', function (done) {
            frisby
                .setup({
                    request: {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }
                })
                .post(baseUrl + '/token', {token: refreshToken})
                .then(response => {
                    expect(response.status).toBe(201);
                })
                .done(done)
        });
    });

    describe('DELETE /logout', () => {
        let accessToken = null;
        let refreshToken = null;
        beforeEach(done => {
            booksApiHelper.resetSessionsDb()
                .then(() => {
                    frisby
                        .post(baseUrl + '/login', {body: {name: 'Yurii', password: '1234567890'}})
                        .then(response => {
                            accessToken = response.json.accessToken;
                            refreshToken = response.json.refreshToken;
                            done()
                        });
                })
        })
        it('should return 204 status', function (done) {
            frisby
                .setup({
                    request: {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }
                })
                .delete(baseUrl + '/logout', {token: refreshToken})
                .then(response => {
                    expect(response.status).toBe(204);
                })
                .done(done)
        });
    });

    describe('PUT /books/:id', () => {
        let accessToken = null;
        beforeEach(done => {
            booksApiHelper.resetSessionsDb()
                .then(() => {
                    frisby
                        .post(baseUrl + '/login', {body: {name: 'Yurii', password: '1234567890'}})
                        .then(response => {
                            accessToken = response.json.accessToken;
                            done()
                        });
                })
        });
        afterEach(done => {
            booksApiHelper.resetBooksDb()
                .then(() => done())
        })
        it('should return success message', function (done) {
            frisby
                .setup({
                    request: {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }
                })
                .put(baseUrl + '/books/1', {title: "newBook1"})
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.json.message).toBe('The title has been changed');
                })
                .done(done)
        });
    });

    describe('DELETE /books/id', () => {
        let accessToken = null;
        beforeEach(done => {
            booksApiHelper.resetSessionsDb()
                .then(() => {
                    frisby
                        .post(baseUrl + '/login', {body: {name: 'Yurii', password: '1234567890'}})
                        .then(response => {
                            accessToken = response.json.accessToken;
                            done()
                        });
                })
        });
        afterEach(done => {
            booksApiHelper.resetBooksDb()
                .then(() => done())
        })

        it('should return success message', function (done) {
            frisby
                .setup({
                    request: {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }
                })
                .delete(baseUrl + '/books/1')
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.json.message).toBe("The book with id 1 has been deleted")
                })
                .done(done)
        });
    });

    describe('POST /users/:user_id/books/:book_id', () => {
        let accessToken = null;
        beforeEach(done => {
            booksApiHelper.resetSessionsDb()
                .then(() => booksApiHelper.resetBooksLibraryDb())
                .then(() => {
                    frisby
                        .post(baseUrl + '/login', {body: {name: 'Yurii', password: '1234567890'}})
                        .then(response => {
                            accessToken = response.json.accessToken;
                            done()
                        });
                })
        });
        afterEach(done => {
            booksApiHelper.resetBooksLibraryDb()
                .then(() => done())
        })
        it("should return added book and it's additional properties", function (done) {
            frisby
                .setup({
                    request: {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }
                })
                .post(baseUrl + "/users/2/books/1")
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.json.title).toBe('book1');
                })
                .done(done)
        });
    });

    describe('GET /users/:id/books', () => {
        let accessToken = null;
        beforeEach(done => {
            booksApiHelper.resetSessionsDb()
                .then(() => booksApiHelper.setBooksLibraryDb())
                .then(() => {
                    frisby
                        .post(baseUrl + '/login', {body: {name: 'Yurii', password: '1234567890'}})
                        .then(response => {
                            accessToken = response.json.accessToken;
                            done()
                        });
                })
        });

        it('should return user library ', function (done) {
            frisby
                .setup({
                    request: {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }
                })
                .get(baseUrl + '/users/2/books')
                .then(response => {
                    expect(response.status).toBe(200);
                    expect(response.json.filteredBooks[0].title).toBe('book1');
                })
                .done(done)
        });
    });

    describe('PUT /users/:user_id/books/:book_id', () => {
        let accessToken = null;
        beforeEach(done => {
            booksApiHelper.resetSessionsDb()
                .then(() => booksApiHelper.setBooksLibraryDb())
                .then(() => {
                    frisby
                        .post(baseUrl + '/login', {body: {name: 'Yurii', password: '1234567890'}})
                        .then(response => {
                            accessToken = response.json.accessToken;
                            done()
                        });
                })
        });
        afterEach(done => {
            booksApiHelper.resetBooksLibraryDb()
                .then(() => done())
        })

        it('should return success message', function (done) {
            frisby
                .setup({
                    request: {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }
                })
                .put(baseUrl + '/users/2/books/1', {currentPage: 25})
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.json.message).toBe("Your reading status has been updated.");
                })
                .done(done)
        });
    });

    describe('DELETE /users/:user_id/books/:book_id', () => {
        let accessToken = null;
        beforeEach(done => {
            booksApiHelper.resetSessionsDb()
                .then(() => booksApiHelper.setBooksLibraryDb())
                .then(() => {
                    frisby
                        .post(baseUrl + '/login', {body: {name: 'Yurii', password: '1234567890'}})
                        .then(response => {
                            accessToken = response.json.accessToken;
                            done()
                        });
                })
        });
        afterEach(done => {
            booksApiHelper.resetBooksLibraryDb()
                .then(() => done())
        })

        it('should return json without deleted book', function (done) {
            frisby
                .setup({
                    request: {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }
                })
                .delete(baseUrl + '/users/2/books/1')
                .then(response => {
                    expect(response.booksLibrary).toEqual(undefined);
                })
                .done(done)
        });
    })
});
