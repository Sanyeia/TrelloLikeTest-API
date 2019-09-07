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
