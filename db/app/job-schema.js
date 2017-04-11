var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobSchema = new Schema({
    url: String,
    is_done: {type: Boolean, default: false},
    output: mongoose.Schema.Types.Mixed
  });

module.exports = mongoose.model('Job', JobSchema);
