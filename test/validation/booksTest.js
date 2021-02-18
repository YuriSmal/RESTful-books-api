const chai = require('chai');
const expect = chai.expect;

const validators = require('../../validators/booksValidators');
const responses = validators.responses;

describe('Get request validation test', () => {
    it('should return success object if validation succeeded', () => {
        let result = validators.validateBooksGetRequest({query: {title: "book1"}});

        expect(result).to.deep.equal(responses.success);
    });
    it('should return invalid object if validation failed', () => {
        let result = validators.validateBooksGetRequest({query: {title: 123}});

        expect(result).to.deep.equal(responses.invalidTitle);
    });
});

describe('Post request validation test', () => {
    it('should return success object if validation succeeded', () => {
        let result = validators.validateBooksPostRequest({body: {title: "LOTR"}});

        expect(result).to.deep.equal(responses.success);
    })
    it('should return invalid object if validation failed', () => {
        let result = validators.validateBooksPostRequest({body: {title: 123}});

        expect(result).to.deep.equal(responses.invalidTitle);
    });
});

describe('Put request validation test', () => {
    it('should return success object if validation succeeded', () => {
        let result = validators.validateBooksPutRequest({params: {id: 1}, body: {title: "book5"}});

        expect(result).to.deep.equal(responses.success);

    })
    it('should return invalid object if validation failed', () => {
        let result = validators.validateBooksPutRequest({params: {id: null}, body: {title: 555}});

        expect(result).to.deep.equal(responses.invalidTitle);
    });
});

describe('Delete request validation test', () => {
    it('should return success object if validation succeeded', () => {
        let result = validators.validateBooksDeleteRequest({params: {id: 2}});

        expect(result).to.deep.equal(responses.success);
    });
    it('should return invalid object if validation failed', () => {
        let result = validators.validateBooksDeleteRequest({params: {id: "abc"}});

        expect(result).to.deep.equal(responses.invalidId);
    });
})