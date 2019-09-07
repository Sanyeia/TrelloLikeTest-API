const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v1');

let getFileName = (url) => {
    url.replace('http://', '');
    url.replace('https://', '');
    url = url.split('/');
    url = url.pop();

    return url;
};

let createFile = (type, file, id = null) => {
    // allowed file extensions
    let validExt = ['png', 'jpg', 'gif', 'jpeg'];

    let nombreImg = file.name.split('.');
    let ImgExt = nombreImg[nombreImg.length - 1];

    if (validExt.indexOf(ImgExt) < 0) {
        return null;
    }

    id = id ? id : uuid();

    // change file name
    let newImgName = `${id}-${new Date().getTime()}-${Math.random().toString(36)}.${ImgExt}`;
    // create the path
    let url = `${process.env.APP_URL}images/${type}/${newImgName}`;

    let typeFolder = path.resolve(__dirname, `../../uploads/${type}`);
    if (!fs.existsSync(typeFolder)) {
        fs.mkdirSync(typeFolder);
    }

    file.mv(`uploads/${type}/${newImgName}`, (err) => {
        if (err) {
            return null;
        }
    });

    return url;
};

let getFile = (type, filename) => {
    let patImg = path.resolve(__dirname, `../../uploads/${type}/${filename}`);
    if (fs.existsSync(patImg)) {
        return {
            'code': 200,
            'file': patImg,
        };
    } else {
        let noImagePath = path.resolve(__dirname, '../../public/assets/no-image.jpg');
        return {
            'code': 404,
            'file': noImagePath,
        };
    }
};

let fileDeleteByType = (type, url) => {
    let filename = getFileName(url);
    let patImg = path.resolve(__dirname, `../../uploads/${type}/${filename}`);
    if (fs.existsSync(patImg)) {
        fs.unlinkSync(patImg);
        return true;
    } else {
        return false;
    }
};

let updateFile = (type, file, url = null) => {

    if (url) {
        this.fileDeleteByType(type, url);
    }

    let result_url = this.createFile(type,file);

    return result_url;
};

module.exports = {
    createFile,
    getFile,
    fileDeleteByType,
    updateFile
}