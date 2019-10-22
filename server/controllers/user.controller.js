const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/user.model');
const Gallery = require('../models/gallery.model');
const config = require('../config/config');
const S3Uploader = require('./aws.controller');

const userSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email(),
  mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
  password: Joi.string().required(),
  repeatPassword: Joi.string().required().valid(Joi.ref('password'))
})


module.exports = {
  insert,
  upload,
  downloadFileS3,
  getGallery
}

async function insert(user) {
  user = await Joi.validate(user, userSchema, { abortEarly: false });
  user.hashedPassword = bcrypt.hashSync(user.password, 10);
  delete user.password;
  return await new User(user).save();
}


async function upload(req, res) {

  console.log('aquiiii');
  let formulario = JSON.parse(req.body.formulario);
  console.log('upload');
  let responseUpload = await uploadWorks(req.files.fileArray);
  if (responseUpload.temErro) {
    console.log('erro no upload de arquivos: ' + JSON.stringify(responseUpload));
    return responseUpload;
  }
  console.log('subi todos os arquivos: ' + JSON.stringify(responseUpload));

  console.log('atualizando  banco');
  let galleryInsert = await saveUpload(responseUpload.filesS3, formulario);

  return galleryInsert;
}


async function saveUpload(filesName, formulario) {


  let work = {
    titulo: formulario.titulo,
    nomeInstituicao: formulario.nomeInstituicao,
    descricao: formulario.descricao,
    caminhoArquivo: filesName[0],
    categoria: formulario.categoria,
    lat: formulario.lat,
    long: formulario.long
  }

  let galleryInsert = await new Gallery(work).save();
  return galleryInsert;

}

async function uploadWorks(files) {

  let retorno = {
    temErro: false,
    mensagem: '',
    filesS3: []
  }

  let fileName;

  console.log('museu/' + files.name);
  fileName = 'museu/' + files.name;
  await S3Uploader.uploadFile(fileName, files.data).then(fileData => {
    console.log('Arquivo submetido para AWS ' + fileName);
    retorno.filesS3.push(fileName);
  }, err => {
    console.log('Erro ao enviar o trabalho para AWS: ' + fileName);
    retorno.temErro = true;
    retorno.mensagem = 'Servidor momentaneamente inoperante. Tente novamente mais tarde.';
  });

  return retorno;

}

async function downloadFileS3(req) {
  console.log('pegando Arquivo ' + req);
  return await S3Uploader.downloadFile(req);
}

async function getGallery(req) {
  let galleryFind = await Gallery.find();
  return galleryFind;
}