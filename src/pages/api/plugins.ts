import { NextApiRequest, NextApiResponse } from "next";
import { getPlugins } from "~/server/server";

/**
 * @swagger
 * /api/plugins:
 *   get:
 *     description: Returns a list of Wellknown ai-plugins json objects from the Wellknown ai-plugins registry.
 *     responses:
 *       200:
 *         description: A list of Wellknown ai-plugins json objects.
 */
export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const searchTerm = req.query.search as string;

  if (method === "GET") {
    const plugins = await getPlugins(searchTerm);

    return res.status(200).json({
      plugins,
    });
  }

  return res.status(405).json({ message: "Method not allowed" });
};

export default handler;
