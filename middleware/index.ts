import auth from '@/middleware/auth'
import nc from 'next-connect'
import onError from '@/middleware/error'

const middleware = nc({ onError })

middleware.use(auth)
export default middleware
