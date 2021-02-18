const responses = {
    success:  {
        isValid: true,
        error: null,
        status: 200
    },
    invalidTitle: {
        isValid: false,
        error:"Invalid title provided",
        status: 422
    },
    invalidId: {
        isValid: false,
        error:"Invalid id provided",
        status: 422
    },
    invalidBookId: {
        isValid: false,
        error:"Invalid book id provided",
        status: 422
    },
    invalidPageValue: {
        isValid: false,
        error:"Invalid page value provided",
        status: 422
    }
}
exports.responses = responses;

exports.validateGetUserLibraryRequest = req => {
    const id = req.params.id;

    if (id && isNaN(id) || id == null) {
        return responses.invalidId;
    }
    return responses.success
}

exports.validateAddBookRequest = req => {
    const user_id = req.params.user_id;
    const book_id = req.params.book_id;

    if (user_id && isNaN(user_id) || user_id == null) {
        return responses.invalidId;
    }
    if (book_id && isNaN(book_id) || book_id == null) {
        return responses.invalidBookId;
    }
    return responses.success
}

exports.validateUpdateReadStatusRequest = req => {
    const bookId = req.params.book_id;
    const userId = req.params.user_id;
    const currentPage = req.body.currentPage;

    if (bookId && isNaN(bookId) || bookId == null) {
        return responses.invalidBookId;
    }
    if (userId && isNaN(userId) || userId == null) {
        return responses.invalidId;
    }
    if (currentPage && isNaN(currentPage) || currentPage == null) {
        return responses.invalidPageValue;
    }
    return responses.success
}

exports.validateDeleteBookRequest = req => {
    const userId = (req.params.user_id);
    const bookId = (req.params.book_id);

    if (userId && isNaN(userId) || userId == null) {
        return responses.invalidId;
    }
    if (bookId && isNaN(bookId) || bookId == null) {
        return responses.invalidBookId;
    }
    return responses.success
}


