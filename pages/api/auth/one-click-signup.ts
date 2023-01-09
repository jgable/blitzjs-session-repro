import { Routes } from "@blitzjs/next"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import { v4 as uuid } from "uuid"
import db from "db"
import { getSession, SecurePassword } from "@blitzjs/auth"

const OneClickSignupSchema = z.object({
  email: z.string().email(),
})

const oneClickSignupHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = OneClickSignupSchema.parse(req.body)

  // Check for existing user, validate details... etc.
  // ..snip...

  // Create the user with a random password
  const hashedPassword = await SecurePassword.hash(uuid().trim())

  const newUser = await db.user.create({
    data: { email, hashedPassword },
  })

  // Create the session
  const session = await getSession(req, res)
  await session.$create({ userId: newUser.id, role: "USER" })

  // Redirect to home page
  void res.redirect(302, Routes.Home().pathname + "?one-click=true").end()

  // Do other signup stuff...
}

export default oneClickSignupHandler
