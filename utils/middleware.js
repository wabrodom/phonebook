const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error : 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error : error.message + ' na ja' })
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


module.exports = {
  errorHandler
}