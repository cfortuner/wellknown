// pages/api/proxy.ts
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import yaml from "js-yaml";

function convertYamlToJson(yamlString: string) {
  try {
    const jsonObj = yaml.load(yamlString);
    return jsonObj;
  } catch (error) {
    console.error("Error converting YAML to JSON:", error);
    return null;
  }
}

function isYamlString(inputString: string) {
  // Regular expression to match a colon followed by a space or a newline
  const yamlPattern = /:\s|\n:/;

  return yamlPattern.test(inputString);
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const targetUrl = req.query.url as string;

  if (!targetUrl) {
    res.status(400).json({ error: "Missing target URL" });
    return;
  }

  const url = decodeURIComponent(targetUrl);
  console.log("Proxying request to: " + url);

  try {
    let response = await axios.get(url, {
      headers: {
        // Optionally, add custom headers here
      },
    });

    // if yaml, convert to json
    if (isYamlString(response.data)) {
      response.data = convertYamlToJson(response.data);
    }

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data from target server" });
  }
};

export default handler;
