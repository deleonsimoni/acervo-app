const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  document: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Email inválido'],
  },
  hashedPassword: {
    type: String,
    required: true
  },
  mailCodePassword: {
    type: String,
    select: false
  },
  icAcceptTerms: {
    type: Boolean,
    default: false
  },
  icAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  dateBirth: {
    type: Date
  },
  address: {
    street: String,
    complement: String,
    num: String,
    zip: String,
    city: String,
    district: String,
    country: String,
    state: String
  },
  phones: {
    cellphone: String,
    telephone: String
  },
  roles: [{
    id: Number
  }]
}, {
  versionKey: false
});


module.exports = mongoose.model('User', UserSchema);
