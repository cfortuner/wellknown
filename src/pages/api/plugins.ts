import { NextApiRequest, NextApiResponse } from "next";
import { getPlugins } from "~/types";

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
