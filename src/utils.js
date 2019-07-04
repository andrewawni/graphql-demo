const jwt = require('jsonwebtoken')
const APP_SECRET = 'secretsecret'

function getUserID(context) {

  const Authorization = context.request.get('Authorization')
  
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}

async function authorize(context, targetUser)
{
  
  const clientID = await getUserID(context);
  let client = await context.prisma.user({
    id: clientID
  });

  if(!client)
    throw new Error('Invalid client');

  if(!targetUser)
    throw new Error('Invalid target');

  if(!(client.id === targetUser.id))
    throw new Error('Unauthorized to complete this process');
  
}
module.exports = {
  APP_SECRET,
  getUserID,
  authorize,
}