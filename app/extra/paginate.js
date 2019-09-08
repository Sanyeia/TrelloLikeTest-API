/**
 * To be able to use this with a model you have to implement the
 * mongoosePaginate plugin first in the desired model
 */

let customLabel = {
    docs: 'data',
    limit: 'perPage',
    nextPage: 'next',
    prevPage: 'prev',
};

let paginate = (model, queryParams, usr_query, usr_option) => {
    //add page and limit to the pagination function in case is sent
    //otherwise uses the default values
    usr_option.page = queryParams.page ? queryParams.page : 1;
    usr_option.limit = queryParams.perPage ? queryParams.perPage : 10;
    usr_option.customLabels = customLabel;

    return model.paginate(usr_query, usr_option);
};

module.exports = paginate;