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
  uploadGaleria,
  deleteDepoimento,
  downloadFileS3,
  getGallery
}

async function insert(user) {
  user = await Joi.validate(user, userSchema, { abortEarly: false });
  user.hashedPassword = bcrypt.hashSync(user.password, 10);
  delete user.password;
  return await new User(user).save();
}

async function uploadGaleria(req) {
  let galeria = JSON.parse(req.body.galeria);
  let galleryInsert = await saveUploadGaleria(galeria);

  return galleryInsert;
}

async function saveUploadGaleria(galeria) {
  let galleryInsert = Gallery.findOne({ '_id': galeria.id }).exec(function(err,book) {
    book.galeria.push( galeria.galeria );
    book.save(function(err){
      console.log('galeria.galeria' + err);
    });
  });
  return galleryInsert;
}

async function upload(req) {
  console.log('aquiiii');
  let formulario = JSON.parse(req.body.formulario);
 
  console.log('atualizando  banco');
  let galleryInsert = await saveUpload(formulario);

  return galleryInsert;
}

async function saveUpload(formulario) {
  let work = {
    nomeInstituicao: formulario.nomeInstituicao,
    galeria: formulario.galeria,
    categoria: formulario.categoria,
    lat: formulario.lat,
    lng: formulario.lng
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
  
  return retorno;
}

async function downloadFileS3(req) {
  console.log('pegando Arquivo ' + req);
  return await S3Uploader.downloadFile(req);
}

async function getGallery(req) {
  var query = { categoria: Number(req.query.categoria) };
  let galleryFind = await Gallery.find(!query.categoria || query.categoria < 1 ? {} : query );
  return galleryFind;
}

async function deleteDepoimento(req) {
   await Gallery.update({},
    { $pull: { galeria: { _id: req }}}, 
    { multi: true }
    )
    .then(
      ()=>{ return "Excluido com sucesso  "},
      err => { return "Erro na exclusao" });
}