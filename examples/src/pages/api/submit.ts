import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const schema = z.object({
  // ...
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = schema.parse(req.body)

  // const id = await addPost()
  // res.redirect(307, `/post/${id}`)

  const id = await createItem(parsed)
  res.status(200).json({ id })
}
