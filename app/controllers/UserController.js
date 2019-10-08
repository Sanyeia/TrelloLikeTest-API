const { showOne, errorResponse, showAll } = require('../extra/responser');
const _uS = require('../services/UserService');

let index = (req, res) => {
    _uS.index().then( (users) => {
        return showAll(res, users, 200);
    })
    .catch( (err) => {
        return errorResponse(res, err, 400);
    });
};

let store = (req, res) => {
    let data = req.body;

    _uS.create(data).then( (user) => {
        return showOne(res, user, 201);
    }).catch( (err) => {
        return errorResponse(res, err, 400);
    });
}

let update = async (req, res) => {
    let id = req.params.id;
    let data = req.body;

    _uS.update(id, data)
    .then( (user) => {
        return showOne(res, user, 200);
    })
    .catch( (err) => {
        return errorResponse(res, err, 400);
    });
};

let remove = (req, res) => {

    _uS.delete(req.params.id)
    .then( (user) => {
        return showOne(res, user, 200);
    })
    .catch( (err) => {
        console.log(err);
        return errorResponse(res, err, 400);
    });
};

module.exports = {
    index,
    store,
    update,
    remove
};