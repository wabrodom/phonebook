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
      // never reach because jws.verify will return its 401 error
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