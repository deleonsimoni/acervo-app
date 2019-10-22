const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  nomeInstituicao: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  caminhoArquivo: {
    type: String,
    required: true
  },
  categoria: {
    type: Number
  },
  lat: {
    type: String,
    required: true
  },
  long: {
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


module.exports = mongoose.model('Gallery', GallerySchema);
