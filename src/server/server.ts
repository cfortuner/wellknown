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
console.log("pluginsJson", pluginsJson);

// import pluginsJson from "../initial-plugins.json";

// a nextjs handler
const allPlugins = pluginsJson.map((plugin) => {
  const { name, manifest } = plugin;
  return {
    name: name,
    installed: false,
    manifest,
  };
});

export const getPlugins = async (searchTerm?: string): Promise<Plugin[]> => {
  if (!searchTerm) {
    console.log(
      "allPlugins",
      allPlugins.map((p) => p.manifest.api)
    );
    return allPlugins as Plugin[];
  }

  const plugins = allPlugins.filter(
    (plugin) =>
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.manifest.name_for_human
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return plugins as Plugin[];
};
