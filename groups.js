module.exports = exports = function(mongoose) {

  var Schema = mongoose.Schema;
  var lastMod = require('./plugins/lastmod');

  var GroupPlanSchema = new Schema({
    plan: {
      type: Schema.ObjectId,
      ref: 'Plan'
    },
    periodicity: {
      type: String,
      default: 'monthly',
      enum: ['monthly', 'semiannual', 'yearly']
    },
    dueDate: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      default: 'off'
    }
  });

  var GroupSchema = new Schema({
    name: {
      type: String,
      default: '',
      trim: true
    },
    email: {
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

  var UserAppSchema = new Schema({
    app: {
      type: Schema.ObjectId,
      ref: 'App'
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'manager', 'superuser'],
      lowercase: true
    },
    status: {
      type: String,
      default: 'active',
      lowercase: true
    }
  });

  var UserGroupSchema = new Schema({
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    group: {
      type: Schema.ObjectId,
      ref: 'Group'
    },
    apps: [UserAppSchema]
  });

  GroupSchema.plugin(lastMod, {
    index: true
  });
  UserGroupSchema.plugin(lastMod, {
    index: true
  });

  GroupSchema.pre('save', function(next) {
    // console.log('pre save', this);
    // if (!this.isNew) return next();
    // var ug = mongoose.model('UserGroup', UserGroupSchema);
    // ug.find({group: this._id});
    next();
  });
  GroupSchema.post('remove', function(group) {
    // var ug = mongoose.model('UserGroup', UserGroupSchema);
    // ug.remove({
    //   group: group._id
    // }, function(err) {
    //   console.log('gs.post', 'UserGroup removed: ', group._id);
    // });
  });

  return {
    Group: mongoose.model('Group', GroupSchema),
    GroupPlan: mongoose.model('GroupPlan', GroupPlanSchema),
    UserGroup: mongoose.model('UserGroup', UserGroupSchema)
  };

};
