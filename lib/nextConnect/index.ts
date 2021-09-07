import { NextApiRequest, NextApiResponse } from 'next'
import nc, { NextConnect } from 'next-connect'

import auth from '@/lib/nextConnect/auth'
import onError from '@/lib/nextConnect/error'

// import sentry from '@/middleware/sentry'

export default (): NextConnect<NextApiRequest, NextApiResponse<any>> => nc({ onError }).use(auth)
