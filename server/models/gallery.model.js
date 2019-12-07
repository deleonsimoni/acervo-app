const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  caminhoArquivo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const LocalSchema = new mongoose.Schema({
  nomeInstituicao: {
    type: String,
    required: true
  },
  galeria: [GallerySchema],
  categoria: {
    type: Number
  },
  lat: {
    type: String,
    required: true
  },
  lng: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});


module.exports = mongoose.model('Gallery', LocalSchema);