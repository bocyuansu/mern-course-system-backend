const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();
require('./config/passport')(passport);
const cors = require('cors');

// 和資料庫建立連線
const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for request
    app.listen(port, () => {
      console.log('連接到MongoDB Atlas，後端伺服器聆聽port: ' + port);
    });
  })
  .catch((e) => {
    console.log(e);
  });

// Routes
const authRoute = require('./routes').auth;
const courseRoute = require('./routes').course;

// middlewares
// 辨識 req.body 的內容
app.use(express.urlencoded({ extended: true }));
// 辨識 json格式 的資料
app.use(express.json());
// 讓 cors 允許 cookie 跨源
app.use(cors());

app.use('/api/user', authRoute);
// course route 應該被 jwt 保護
// 如果認證成功，則會觸發 next，並可以在 res.user 中拿到被認證的使用者
app.use(
  '/api/courses',
  passport.authenticate('jwt', { session: false }),
  courseRoute
);
