const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { User } = require('../models')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')

const router = express.Router()

router.get('/', isNotLoggedIn, (req, res, next) => {
  res.render('auth')
})

// 회원가입 라우터
router.post('join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body
  try {
    const exUser = await User.findOne({ where: { email } })
    if (exUser) {
      return res.redirect('/auth')
    } else {
      console.time('암호화 시작')
      const hash = await bcrypt.hash(password, 12)
      console.timeEnd('암호화 끝')
      await User.create({
        email,
        nick,
        password: hash,
      })
      return res.redirect('/')
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// 로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError)
      return next(authError)
    }
    if (!user) {
      return res.redirect('/auth')
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError)
        return next(loginError)
      }
      return res.redirect('/')
    })
  })(req, res, next)
})

// 로그아웃 라우터
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

module.exports = router