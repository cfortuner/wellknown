import fs from "fs";
import path from "path";
import { Plugin } from "~/types";

function loadPluginsJson(directory: string) {
  const pluginFiles = [];

  const folders = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

  for (const folder of folders) {
    const filePath = path.join(directory, folder, "ai-plugin.json");
    if (fs.existsSync(filePath)) {
      const jsonContent = fs.readFileSync(filePath, "utf-8");
      const manifest = JSON.parse(jsonContent);
      pluginFiles.push({
        name: folder,
        manifest,
      });
    }
  }

  return pluginFiles;
}

const pluginsDirectory = path.join(process.cwd(), "plugins");
const pluginsJson = loadPluginsJson(pluginsDirectory);

// import pluginsJson from "../initial-plugins.json";

// a nextjs handler
let allPlugins: any;

export const getPlugins = async (searchTerm?: string): Promise<Plugin[]> => {
  if (!allPlugins) {
    allPlugins = await Promise.all(
      pluginsJson.map(async (plugin) => {
        const { name, manifest } = plugin;
        let openAPI;
        try {
          const res = await fetch(manifest.api.url);
          openAPI = await res.json();
        } catch (e) {
          console.log("error", e);
        }

        console.log("openAPI", openAPI);

        return {
          name: name,
          installed: false,
          manifest,
          openAPI: openAPI || {},
        };
      })
    );
  }

  if (!searchTerm) {
    return allPlugins as Plugin[];
  }

  const plugins = allPlugins.filter(
    (plugin: any) =>
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.manifest.name_for_human
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return plugins as Plugin[];
};
