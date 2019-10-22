const AWS = require('aws-sdk');
const config = require('../config/config');

module.exports = {
  uploadFile,
  downloadFile
}

function uploadFile(key, file) {
  const s3 = new AWS.S3({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  });

  var s3Config = {
    Bucket: 'museupedagogico',
    Key: key,
    Body: file
  };

  return new Promise((resolve, reject) => {
    s3.putObject(s3Config, (err, resp) => {
      if (err) {
        console.log('Erro AWS', err);
        reject({ success: false, data: err });
      }
      resolve({ sucess: true, data: resp });
    })
  });
}

async function downloadFile(key) {

  const s3 = new AWS.S3({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  });

  var s3Config = {
    Bucket: 'museupedagogico',
    Key: key
  };

  return new Promise((resolve, reject) => {
    s3.getObject(s3Config, (err, resp) => {
      if (err) {
        console.log('Erro AWS', err);
        reject({ success: false, data: err });
      }
      resolve({ sucess: true, data: resp });
    })
  })
};