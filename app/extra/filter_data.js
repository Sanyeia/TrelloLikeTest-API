var _ = require('underscore');
_.mixin({ deepPick: require('deep_pick') });

const hidden = [
    '_id',
    '__v',
    'photo',
    'deleted'
];

/**
 * Create the json object with the given data
 */
let setData = (body, keys) => {
    let result = {};

    keys.forEach(key => {
        result[key] = body[key];
    });

    return result;
}

/**
 * Filter and create the json object with the given data
 *
 * @param {Object} rules
 * @param {json} data
 * @param {boolean} assign
 *
 * @return {json}
 */
let filter = (data, model, assign = true) => {
    let keys = [];
    let attbrs;
    let nested = [];

    //iterate over the schema attributes
    model.schema.eachPath(function (path) {
        //checks if its a nested attribute
        attbrs = path.split('.');

        if (attbrs.length != 1) {
            //checks if the attribute is hidden
            if (hidden.indexOf(path) < 0) {
                nested.push(path);
            }
        } else {
            //checks if the attribute is hidden
            if (hidden.indexOf(path) < 0) {
                keys.push(path);
            }
        }
    });

    let body = _.pick(data, keys);

    if (assign) {
        body = setData(body, keys);
    }

    return body;
}

module.exports = {
    filter,
    setData
};