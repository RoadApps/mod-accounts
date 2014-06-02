module.exports = exports = function (mongoose) {

  var lastMod = require('./plugins/lastmod');

  var AppSchema = new mongoose.Schema({
    name: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    url: {
      type: String,
      default: '',
      trim: true,
      lowercase: true
    },
    url_api: {
      type: String,
      default: ''
    },
    class: {
      type: String,
      default: ''
    },
    user_role: {
      type: String,
      default: 'all'
    },
    status: {
      type: String,
      default: 'active',
      lowercase: true
    }
  });

  AppSchema.plugin(lastMod, {
    index: true
  });

  return {
    App: mongoose.model('App', AppSchema)
  };

}
