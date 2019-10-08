const { getFile } = require('../extra/file_util');

module.exports = {
    getImage(req, res) {
        let type = req.params.type;
        let name = req.params.name;
    
        let result = getFile(type, name);
    
        res.status(result.code).sendFile(result.file);
    }
};