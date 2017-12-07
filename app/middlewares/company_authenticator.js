const sequelize = require('../models');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const ApiError = require('../errors/api_error');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json(new ApiError('Token not provided.', 401));
  }

  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json(new ApiError('Token not provided.', 401));
  }

  return jwt.verify(token, app.get('jwtKey'), (err, decoded) => {
    if (err) {
      return res.status(403).end();
    }

    return sequelize.Company.findOne({where: {identifier: decoded.identifier}})
      .then((company) => {
        if (!company) {
          return res.status(401).end();
        }

        req.company = company;
        next();

        return null;
      })
      .catch(() => res.status(401).end());
  });
};
