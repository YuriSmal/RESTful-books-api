FORMAT: 1A
HOST: http://localhost:8000

# RESTful-books-api

This is a simple API allowing to view, add, edit or delete books. <br>
Additional implementations: login, logout, user roles management, separate book libraries for users.

## Sign up [/users]

### Add user [POST]

+ Request (application/json)

        {
            "name": "Yurii",
            "password": "1234567890"
        }

+ Response 202 (application/json)

  + Body

          {
              "name": "Yurii",
              "password": "$2b$10$fqSqlAN3ZxQneoLfXuLl4.dsBf0kkrIneQGI0K3kFif780ZVbPQw2"
          }


## Login [/login]

### Login [POST]

+ Request (application/json)

        {
            "name": "Yurii",
            "password" : "1234567890"
        }

+ Response 201 (application/json)

        {
            "message": "Successfully logged in as Yurii",
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWXVyaWkiLCJwYXNzd29yZCI6IiQyYiQxMCRNeGdPVGtpek5iN1FPaDNWU1lZY0tlQnRVMEhSLjNDbFFMaVVPNVk4WVVOS3hhSFEwY3RYYSIsImlhdCI6MTYxMjg3OTUyNCwiZXhwIjoxNjEyODc5NTM5fQ.xj8PsMH57p4ZMiw26XpjiEWd_0TozJl0QMcKJqkqYcw",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWXVyaWkiLCJwYXNzd29yZCI6IiQyYiQxMCRNeGdPVGtpek5iN1FPaDNWU1lZY0tlQnRVMEhSLjNDbFFMaVVPNVk4WVVOS3hhSFEwY3RYYSIsImlhdCI6MTYxMjg3OTUyNH0.aO-HUtN71glhQx_R9IW5PLU3TOP5ozKmJCEOmCGQC50"
        }

## Logout [/logout]

Note:  "token" = refresh token.
###Logout [DELETE]

+ Request

        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWXVyaWkiLCJwYXNzd29yZCI6IiQyYiQxMCRNeGdPVGtpek5iN1FPaDNWU1lZY0tlQnRVMEhSLjNDbFFMaVVPNVk4WVVOS3hhSFEwY3RYYSIsInJvbGUiOiJhZG1pbiIsImlkIjoyLCJpYXQiOjE2MTM3NDI4MTJ9.Qqz3IfxBIpBv9R9OLfEqMgRV6TbV1AIHYfoQxQE6mac"
        }

+ Response 204

## Get & add books  [/books]

Note: These options are available only for users with role "admin"

### Get list of all books [GET]

+ Request (application/json)

  + Headers

          Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWXVyaWkiLCJwYXNzd29yZCI6IiQyYiQxMCRNeGdPVGtpek5iN1FPaDNWU1lZY0tlQnRVMEhSLjNDbFFMaVVPNVk4WVVOS3hhSFEwY3RYYSIsImlhdCI6MTYxMjg3OTUyNCwiZXhwIjoxNjEyODc5NTM5fQ.xj8PsMH57p4ZMiw26XpjiEWd_0TozJl0QMcKJqkqYcw

+ Response 200 (application/json)

            {
                "books": [
                   {
                        "title": "book1",
                        "author": "someone1",
                        "id": 1,
                        "pages": 100
                    },
                    {
                        "title": "book2",
                        "author": "someone2",
                        "id": 2,
                        "pages": 200
                    },
                    {
                        "title": "book3",
                        "author": "someone3",
                        "id": 3,
                        "pages": 300
                    },
                    {
                        "title": "book4",
                        "author": "someone4",
                        "id": 4,
                        "pages": 400
                    },
                    {
                        "title": "book5",
                        "author": "someone5",
                        "id": 5,
                        "pages": 500
                    }
                ]
            }

### Add book [POST]

+ Request (application/json)

  + Headers

          Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWXVyaWkiLCJwYXNzd29yZCI6IiQyYiQxMCRNeGdPVGtpek5iN1FPaDNWU1lZY0tlQnRVMEhSLjNDbFFMaVVPNVk4WVVOS3hhSFEwY3RYYSIsImlhdCI6MTYxMjg3OTUyNCwiZXhwIjoxNjEyODc5NTM5fQ.xj8PsMH57p4ZMiw26XpjiEWd_0TozJl0QMcKJqkqYcw

  + Body

          {
              "title": "book1",
              "author": "someone1",
              "pages": 500
          }

+ Response 201 (application/json)

        {
            "title": "book1",
            "author": "someone1",
             "pages": 500
        }

## Edit & delete books [/books/{id}]

Note: These options are available only for users with role "admin"

+ Parameters
  + id (number) - 1

### Edit books [PUT]

+ Request (application/json)

  + Headers

          Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWXVyaWkiLCJwYXNzd29yZCI6IiQyYiQxMCRNeGdPVGtpek5iN1FPaDNWU1lZY0tlQnRVMEhSLjNDbFFMaVVPNVk4WVVOS3hhSFEwY3RYYSIsImlhdCI6MTYxMjg3OTUyNCwiZXhwIjoxNjEyODc5NTM5fQ.xj8PsMH57p4ZMiw26XpjiEWd_0TozJl0QMcKJqkqYcw

  + Body

          {
              "title": "newBook"
          }

+ Response 201 (application/json)

            {
                "title": "newBook"
            }

### Delete books [DELETE]

+ Request (application/json)

  + Headers

          Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWXVyaWkiLCJwYXNzd29yZCI6IiQyYiQxMCRNeGdPVGtpek5iN1FPaDNWU1lZY0tlQnRVMEhSLjNDbFFMaVVPNVk4WVVOS3hhSFEwY3RYYSIsImlhdCI6MTYxMjg3OTUyNCwiZXhwIjoxNjEyODc5NTM5fQ.xj8PsMH57p4ZMiw26XpjiEWd_0TozJl0QMcKJqkqYcw

+ Response 200 (application/json)

            {
                 "message": "The book with id 2 has been deleted"
            }

## Add books to the library of the particular user, delete book, or set reading status [/users/{user_id}/books/{book_id}]

Note: These options are available only for users with any role. <br><br>
The users can set the current page of reading. If it's equal to the number of book pages, the book will be marked as 'completed'


+ Parameters
  + user_id (number) - 1
  + book_id (number) - 1

### Add books to the library [POST]

+ Request (application/json)

  + Headers

          Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWXVyaWkiLCJwYXNzd29yZCI6IiQyYiQxMCRNeGdPVGtpek5iN1FPaDNWU1lZY0tlQnRVMEhSLjNDbFFMaVVPNVk4WVVOS3hhSFEwY3RYYSIsImlhdCI6MTYxMjg3OTUyNCwiZXhwIjoxNjEyODc5NTM5fQ.xj8PsMH57p4ZMiw26XpjiEWd_0TozJl0QMcKJqkqYcw

+ Response 201 (application/json)

        {
            "title": "book1",
            "author": "test1",
            "id": 1,
            "pages": 100,
            "addedByUserId": 1,
            "currentPage": 1,
            "isReadingCompleted": false
        }

### Delete books from the library [DELETE]

+ Request

  + Headers

          Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWXVyaWkiLCJwYXNzd29yZCI6IiQyYiQxMCRNeGdPVGtpek5iN1FPaDNWU1lZY0tlQnRVMEhSLjNDbFFMaVVPNVk4WVVOS3hhSFEwY3RYYSIsImlhdCI6MTYxMjg3OTUyNCwiZXhwIjoxNjEyODc5NTM5fQ.xj8PsMH57p4ZMiw26XpjiEWd_0TozJl0QMcKJqkqYcw

+ Response 200

### Set reading status [PUT]

+ Request (application/json)

  + Headers

          Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWXVyaWkiLCJwYXNzd29yZCI6IiQyYiQxMCRNeGdPVGtpek5iN1FPaDNWU1lZY0tlQnRVMEhSLjNDbFFMaVVPNVk4WVVOS3hhSFEwY3RYYSIsImlhdCI6MTYxMjg3OTUyNCwiZXhwIjoxNjEyODc5NTM5fQ.xj8PsMH57p4ZMiw26XpjiEWd_0TozJl0QMcKJqkqYcw

  + Body

          {
              "currentPage": 100
          }  

+ Response 201 (application/json)

         {
            "message": "Your reading status has been updated."
         }

## Get the library of the particular user [/users/{id}/books]

### Get the library [GET]

+ Request

  + Headers

          Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWXVyaWkiLCJwYXNzd29yZCI6IiQyYiQxMCRNeGdPVGtpek5iN1FPaDNWU1lZY0tlQnRVMEhSLjNDbFFMaVVPNVk4WVVOS3hhSFEwY3RYYSIsImlhdCI6MTYxMjg3OTUyNCwiZXhwIjoxNjEyODc5NTM5fQ.xj8PsMH57p4ZMiw26XpjiEWd_0TozJl0QMcKJqkqYcw

+ Response 200 (application/json)

                {   
                    "title": "book1",
                    "author": "test1",
                    "id": 1,
                    "pages": 100,
                    "addedByUserId": 1,
                    "currentPage": 1,
                    "isReadingCompleted": false
                }