const helper = require('./helper')

const errorHandler = (error, request, response, next) => {
  // console.log("middleware catch an error", JSON.stringify(error, 0, 2))

  if (error.name === 'CastError') {
    return response.status(400).send({ error : 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error : error.message + ' na ja' })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected username to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: error.message
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: error.message
    })
  }
  console.info('begin >>', error, '<< end')
  next(error)
}


const tokenExtracter = (request, response ,next) => {
  request.token = helper.getTokenFrom(request)
  next()
}

const userExtracter =  async (request, response, next) => {
  request.user = await helper.decodedTokenGetUser(request, response, next)
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint ' })
}


module.exports = {
  errorHandler,
  tokenExtracter,
  userExtracter,
  unknownEndpoint
}