const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  const regex = /Bearer /i
  if (authorization && authorization.match(regex)) {
    const newString = authorization.replace(regex, '')
    return newString
  }
  return null
}

const decodedTokenGetUser = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      // never reach because jws.verify will return its 401 response Unauthorized
      // we get response object return, so work around by check if it has object key
      // if not return nothing to client
      return response.status(401).json({ error: 'invalid token...' })
    }

    const user = await User.findById(decodedToken.id)
    return user
  } catch(error) {
    if (error.name === 'JsonWebTokenError') {
      // console.log('In case of JsonWebTokenError this will logged')
      return response.status(401).json({
        error: error.message,
        unicorn: 'something unicorn'
      })
    }
    next(error)
  }
}

module.exports = {
  getTokenFrom,
  decodedTokenGetUser
}



/*
// try this in the future

module.exports = function(req,res,next){
    var bearerHeader = req.headers['authorization'];
    var token;
    console.log(bearerHeader);
    req.authenticated = false;
    if (bearerHeader){
        console.log("11111");
        var bearer = bearerHeader.split(" ");
        token = bearer[1];
        jwt.verify(token, config.secret, function (err, decoded){
            console.log("22222");
            if (err){
                console.log(err);
                req.authenticated = false;
                req.decoded = null;
                next();
            } else {
                console.log("33333");
                req.decoded = decoded;
                req.authenticated = true;
                next();
            }
        });
    }
}
*/