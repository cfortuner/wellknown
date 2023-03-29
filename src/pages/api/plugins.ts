import { NextApiRequest, NextApiResponse } from "next";
import { getPlugins } from "~/server/plugins";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === "GET") {
    const plugins = await getPlugins();

    return res.status(200).json({
      plugins: plugins,
    });
  }

  return res.status(405).json({ message: "Method not allowed" });
};

export default handler;
