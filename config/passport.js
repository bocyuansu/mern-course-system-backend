let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models').user;

module.exports = (passport) => {
  let opts = {};
  // jwtFromRequest 可以指定抓取 token 存放的位置
  // 從 authorization header 中尋找 JWT
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  // secretOrKey 設定加密的金鑰
  opts.secretOrKey = process.env.PASSPORT_SECRET;

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();
        if (foundUser) {
          // 將 foundUser 設定到 req.user
          return done(null, foundUser);
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
