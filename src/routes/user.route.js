const bcrypt = require('bcryptjs');
const express = require('express');
const { BAD_REQUEST } = require('http-status-codes');

const auth = require('../middleware/auth.js');
const User = require('../models/user.model');

const ZERO = 0;
const router = express.Router();

router.get('/', auth, (req, res) => {
  const { email } = req.body;

  User.findById(req.user.id)
    .select('-password')
    .then((user) => {
      if (!email) {
        res.status(BAD_REQUEST).json({ message: 'Missing required parameter: email' });
      } else if (email === user.email || user.userType === 'nurse') {
        User.find()
          .where({ email })
          .select('-password')
          .then((users) => {
            if (users.length) {
              res.json(users[ZERO]);
            } else {
              res
                .status(BAD_REQUEST)
                .json({ message: 'No users found' });
            }
          });
      } else {
        res
          .status(401)
          .json({ message: 'Permission denied' });
      }
    });
});

router.post('/', auth, (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    res
      .status(BAD_REQUEST)
      .json({ message: 'Request body is missing required field.' });
  } else {
    User.findOne({ email }).then((user) => {
      if (user) {
        res
          .status(BAD_REQUEST)
          .json({ message: 'User with this email already exists.' });
      } else {
        const newUser = new User({
          email,
          password,
          userType,
        });

        // hashing password
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            throw err;
          }
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) {
              throw error;
            }
            newUser.password = hash;
            newUser.save().then((createdUser, dbError) => {
              if (dbError) {
                res
                  .status(BAD_REQUEST)
                  .json({ message: dbError });
              }
              res
                .json(
                  {
                    user: {
                      email: createdUser.email,
                      userType: createdUser.userType,
                      id: createdUser.id,
                    },
                  },
                );
            });
          });
        });
      }
    });
  }
});
module.exports = router;
