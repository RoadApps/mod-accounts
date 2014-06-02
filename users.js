module.exports = exports = function(mongoose) {

  var Schema = mongoose.Schema;
  var crypto = require('crypto');
  var lastMod = require('./plugins/lastmod');
  var _ = require('underscore');

  var UserSchema = new Schema({
    name: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: '',
      lowercase: true
    },
    username: {
      type: String,
      default: '',
      lowercase: true
    },
    type: {
      type: String,
      default: 'normal',
      lowercase: true
    },
    groups: [{
      type: Schema.ObjectId,
      ref: 'Group'
    }],
    provider: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'active',
      lowercase: true
    },
    hashed_password: {
      type: String,
      default: ''
    },
    salt: {
      type: String,
      default: ''
    },
    auth_token: {
      type: String,
      default: ''
    }
  });

  var UserActivitySchema = new Schema({
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    app: {
      type: Schema.ObjectId,
      ref: 'App'
    },
    info: Schema.Types.Mixed,
    activity: {
      type: String,
      default: ''
    }
  });

  UserSchema
    .virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
      return this._password;
    })

  var validatePresenceOf = function(value) {
    return value && value.length;
  }

  UserSchema.path('name').validate(function(name) {
    return name.length;
  }, 'Name cannot be blank')

  UserSchema.path('email').validate(function(email) {
    return email.length;
  }, 'Email cannot be blank')

  UserSchema.path('email').validate(function(email, fn) {
    var User = mongoose.model('User');

    if (this.isNew || this.isModified('email')) {
      User.find({
        email: email
      }).exec(function(err, users) {
        fn(err || users.length === 0)
      });
    } else fn(true);
  }, 'Email already exists')

  UserSchema.path('hashed_password').validate(function(hashed_password) {
    return this._password === '' || hashed_password.length;
  }, 'Password cannot be blank')

  UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password))
      next(new Error('Senha inválida'));
    else
      next();
  });
  UserSchema.methods = {

    authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashed_password;
    },

    makeSalt: function() {
      return Math.round(new Date().valueOf() * Math.random()) + crypto.randomBytes(128).toString('base64');
    },

    encryptPassword: function(password) {
      if (!password) return '';
      var encrypred;
      try {
        encrypred = crypto.pbkdf2Sync(password, this.salt, 1000, 128).toString('hex');
        return encrypred;
      } catch (err) {
        return '';
      }
    }
  }

  UserSchema.plugin(lastMod, {
    index: true
  });

  return {
    User: mongoose.model('User', UserSchema),
    UserActivity: mongoose.model('UserActivity', UserActivitySchema)
  };

};
