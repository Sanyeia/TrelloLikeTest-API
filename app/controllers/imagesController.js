const express = require('express');
const { checkToken } = require('../middlewares/auth');
const { getFile } = require('../extra/file_util');
const app = express();

app.get('/:type/:name', [checkToken], (req, res) => {
    let type = req.params.type;
    let name = req.params.name;

    let result = getFile(type, name);

    res.status(result.code).sendFile(result.file);
});

module.exports = app;