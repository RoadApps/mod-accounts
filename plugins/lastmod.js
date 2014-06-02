/*
  var lastMod = require('./plugins/lastmod');
  TheModel.plugin(lastMod);
*/

module.exports = exports = function lastModifiedPlugin(schema, options) {

  schema.add({
    lastModified: {
      type: Date,
      default: Date.now
    },
  });

  schema.pre('save', function(next) {
    this.lastModified = new Date;
    next();
  })

  if (options && options.index) {
    schema.path('lastModified').index(options.index);
  }

}
