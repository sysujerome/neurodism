const mongoose = require('mongoose');

const database = "neurodism"
mongoose.connect('mongodb://visitor:visitor@193.112.28.37/' + database + "?authSource=admin");
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongodb: error'));
db.once('open', () => console.log('mongodb: connected'));

const wordSchema = mongoose.Schema({
  n: String, t: String
});

const diseaseSchema = mongoose.Schema({
  d: String, m: Number, g: [String]
});

const geneSchema = mongoose.Schema({
  g: String, c: String,
  b: Number, e: Number
});

const diseasePairSchema = mongoose.Schema({
  d1: String, d2: String,
  v: {
    g: Number, m: Number, p: Number
  },
  s: Number,
  g: [String], m: [String]
});

const genePairSchema = mongoose.Schema({
  g1: String, g2: String,
  d: [String]
});

const mutationSchema = mongoose.Schema({
  id: String, pid: String,
  st: String, pt: String,
  pro: String, pop: String,
  gene: String, chr: String, pos: String,
  ref: String, ale: String,
  var: String, val: String,
  fc: String, pv: String, mut: String
});

const dropDatabase = function() {
  return db.dropDatabase();
};

const model = {
  dis: mongoose.model('disease', diseaseSchema),
  gene: mongoose.model('gene', geneSchema),
  dp: mongoose.model('disease_pair', diseasePairSchema),
  gp: mongoose.model('gene_pair', genePairSchema),
  mut: mongoose.model('mutation', mutationSchema),
  word: mongoose.model('word', wordSchema),
  drop: dropDatabase
};

module.exports = model;
