module.exports = exports = function(mongoose) {

  var Schema = mongoose.Schema;
  var lastMod = require('./plugins/lastmod');

  var PlanSchema = new Schema({
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
    apps: [{
      type: Schema.ObjectId,
      ref: 'App'
    }],
    price: Number,
    status: {
      type: String,
      default: 'active',
      lowercase: true
    },
    createdBy: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  });

  PlanSchema.plugin(lastMod, {
    index: true
  });

  return {
    Plan: mongoose.model('Plan', PlanSchema)
  };

};
