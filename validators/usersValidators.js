const responses = {
    success:  {
        isValid: true,
        error: null,
        status: 200
    },
    invalidName: {
        isValid: false,
        error:"Invalid name provided",
        status: 422
    },
    invalidPassword: {
        isValid: false,
        error:"Invalid password provided",
        status: 422
    }
}
exports.responses = responses;

exports.validateUsersPostRequest = (req) => {
    const name = req.body.name;
    const password = req.body.password;

    if (name && name.length < 4 || name == null || typeof name === 'number') {
        return responses.invalidName;
    }

    if (password && password.length < 9 || password == null) {
        return responses.invalidPassword;
    }
    return responses.success
}