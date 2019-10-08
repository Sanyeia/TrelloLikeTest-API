//Main Custom Error Class
class DomainError extends Error {
    constructor(message) {
        super(message);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

//API Errors

class ResourceNotFoundError extends DomainError {
    constructor(resource, query) {
        super(`${resource} not found.`);
        this.data = { resource, query };
    }
}

class InternalError extends DomainError {
    constructor(error) {
        super(error.message);
        this.data = { error };
    }
}

module.exports = {
    ResourceNotFoundError,
    InternalError,
};