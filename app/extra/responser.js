const { ResourceNotFoundError, InternalError } = require('../extra/errorHandler');

module.exports = {

  showAll(res, data, code = 200) {
    data.code = 200;
    return res.status(code).json(data);
  },

  showOne(res, data, code = 200) {
    return res.status(code).json({
      code,
      data
    });
  },

  normalResponse(res, msg, code = 200) {
    return res.status(code).json({
      code,
      message: msg
    });
  },

  errorResponse(res, error, code = 400) {
    if(error.name){
      //checks if the error is because the id is invalid (probably because of a bad parameter)
      if(error.name === 'CastError' && error.kind === 'ObjectId'){
        error = 'Missing/Invalid parameters, please read the documentation and try again';
      }
    }

    if(error instanceof ResourceNotFoundError){
      code = 404;
      error = `Instance of the ${error.data.resource} resource not found`;
    }

    if(error instanceof InternalError){
      code = 500;
      error = `Something went wrong, please try again later`;
    }

    return res.status(code).json({
      code,
      error
    });
  },

};
