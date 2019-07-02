const jwt = require('jsonwebtoken')
const APP_SECRET = 'secretsecret'

function getUserId(context) {
  const Authorization = context.request.get('Authorization')
//   console.log(context.request);
  
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  getUserId,
}