const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const { User } = require('../models')

router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('index', {
      text: req.user.nick,
      isLoggedin: req.isAuthenticated(),
    })
  } else {
    res.render('index', {
      text: '로그인 필요',
      isLoggedin: req.isAuthenticated()
    })
  }
})

module.exports = router