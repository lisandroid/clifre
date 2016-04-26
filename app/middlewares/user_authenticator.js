var sequelize       = require('../models');
var app             = require('../../app');
var jwt             = require('jsonwebtoken');
var ApiError        = require('../errors/api_error');

module.exports = function (req, res, next) {
  if (!req.headers['authorization']) {
    return res.status(401).json(new ApiError('Token not provided.', 401));
  }

  var token = req.headers['authorization'].split(' ')[1];
  if (!token) return res.status(401).json(new ApiError('Token not provided.', 401));

  return jwt.verify(token, app.get('jwtKey'), function(err, decoded) {
    if (err) return res.status(403).end();
    return sequelize.User.findOne(
      {where: {identifier: decoded.identifier},
        attributes: ['id', 'name', 'email', 'identifier', 'birthdate', 'avatar', 'avatarName']})
      .then(function (user) {
        if (!user) return res.status(401).end();
        req.user = user;
        return next();
      })
      .catch(function (err) { return res.status(401).end(); });
  });
};