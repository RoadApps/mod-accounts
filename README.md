# RoadApps Accounts Scheme

```bash
  $ npm install roadapps.accounts
```

## Usage

```js
  var mongoose = require('mongoose');
  var Schemas = require('roadapps.accounts')(mongoose);
  var User = Schemas.User;
  User.find().exec(function(err, users) {
      console.dir(users);
  });
  var app = new Schemas.App();
  app.name = 'hello';
  app.save();
```
