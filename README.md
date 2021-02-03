RESTful Express Books App
=========

#### This is a test RESTful app, that allows user to _add_, _update_, _delete_ or _view_ books using GET, POST, PUT and DELETE HTTP methods

## Usage
- To add a book: **POST** + http://localhost:8000/books/
<br> Req body: `{
  "title": "title",
  "author": "author"
  }
  `
- To update a book: **PUT** + http://localhost:8000/books/:id
<br> Req body: `{
  "title": "newTitle"
  }`
- To delete a book: **DELETE** + http://localhost:8000/books/:id
<br>
- To view:
  - all books: **GET** + http://localhost:8000/books/
  - the specific book: **GET** +  http://localhost:8000/books?title=title&author=author
  - to set pagination: **GET** + http://localhost:8000/books?page=1&limit=5

## Tests

`npm test`
