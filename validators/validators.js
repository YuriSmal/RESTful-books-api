const responses = {
    success:  {
        isValid: true,
        error: null,
        status: 200
    },
    invalidAuthor: {
        isValid: false,
        error:"Invalid author provided",
        status: 422
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
    }
}
exports.responses = responses;

exports.validateBooksGetRequest = (req) => {
    const author = req.query.author;
    const title = req.query.title;



    if (author && author.length < 1 || typeof author === "number") {
        return responses.invalidAuthor;
    }

    if (title && title.length < 1 || typeof title === "number") {
        return responses.invalidTitle;

    }
    return  responses.success
}

exports.validateBooksPostRequest = (req) => {
    const title = req.body.title;
    const author = req.body.author;

    if (title && title.length <= 2 || typeof title === "number") {
        return responses.invalidTitle;
    }

    if (author && author.length <= 2 || typeof author === "number") {
        return responses.invalidAuthor;
    }
    return responses.success;
}

exports.validateBooksPutRequest = (req) => {
        const title = req.body.title;
        const id = (req.params.id);

        if (title && title.length <= 2 || typeof title === "number") {
            return responses.invalidTitle;
        }

        if (id && isNaN(id) || id == null) {
            return responses.invalidId;
        }
        return responses.success
}

exports.validateBooksDeleteRequest = (req) => {
    let id = (req.params.id);

    if (id && isNaN(id) || id == null) {
        return responses.invalidId;
    }
    return responses.success
}