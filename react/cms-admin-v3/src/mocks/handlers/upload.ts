import { rest } from "msw";
import { db } from "../db";

export const fileUpload = rest.post(
  '/file',
  async (req, res, ctx) => {
    const file = db.file.getAll()
    return res(
      ctx.delay(300),
      ctx.json(file[0])
    )
  }
)

export const chunkFileUpload = rest.post(
  '/chunkFile',
  async (req, res, ctx) => {
    return res(
      ctx.delay(300),
      ctx.json({ data: req })
    )
  }
)