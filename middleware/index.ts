import nc from 'next-connect'
import auth from './auth'
import onError from './error'

const middleware = nc({ onError })

middleware.use(auth)
export default middleware
