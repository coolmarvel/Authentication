const express = require("express");
const path = require("path");
const morgan = require("morgan");
const passport = require('passport')
const session = require("express-session");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

const { sequelize } = require("./models");
const passportConfig = require('./passport')

const app = express();
sequelize.sync();
passportConfig(passport)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.set('port', process.env.PORT || 8070);

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  }
}))
app.use(passport.initialze())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/auth', authRouter)

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404;
  next(err)
})

app.use((err, req, res) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
})

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 서버 대기 중')
})

