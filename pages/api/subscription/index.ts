import { NextApiResponse } from 'next'
import nc from 'next-connect'
import { subscription } from '../../../db'
import middleware from '../../../middleware/all'
import onError from '../../../middleware/error'
import { Request } from '../../../types'

const handler = nc<Request, NextApiResponse>({
  onError,
})

handler.use(middleware)
handler.post(async (req, res) => {
  const newFolder = await subscription.createSubscription(req.db, { createdBy: req.user.id, name: req.body.name })
  res.send({ data: newFolder })
})

export default handler
