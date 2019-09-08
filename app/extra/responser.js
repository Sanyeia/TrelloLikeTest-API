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

  errorResponse(res, error, code = 400) {
    if(error.name){
      //checks if the error is because the id is invalid (probably because of a bad parameter)
      if(error.name === 'CastError' && error.kind === 'ObjectId'){
        error = 'Missing/Invalid parameters, please read the documentation and try again';
      }
    }
    return res.status(code).json({
      code,
      error
    });
  },

  normalResponse(res, msg, code = 200) {
    return res.status(code).json({
      code,
      message: msg
    });
  }

};
