import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import * as z from "zod";

import fs from "fs";
import path from "path";

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

type ManifestAuthType = "none" | "user_http" | "service_http" | "oauth";

const ManifestAuthType: {
  [key in ManifestAuthType]: ManifestAuthType;
} = {
  none: "none",
  user_http: "user_http",
  service_http: "service_http",
  oauth: "oauth",
};

interface BaseManifestAuth {
  type: ManifestAuthType;
  instructions?: string;
  has_user_authentication: boolean;
}

interface ManifestNoAuth extends BaseManifestAuth {
  type: "none";
}

interface ManifestServiceHttpAuth extends BaseManifestAuth {
  type: "service_http";
  authorization_type: "bearer";
  verification_tokens: {
    openai: string; //"cdfcc1dadb3540b8aa7c5c5f1512849b";
  };
}
// typeguard for ManifestNoAuth
export const isManifestNoAuth = (
  auth: ManifestAuth
): auth is ManifestNoAuth => {
  return auth.type === "none";
};
// typeguard for ManifestServiceHttpAuth
export const isManifestServiceHttpAuth = (
  auth: ManifestAuth
): auth is ManifestServiceHttpAuth => {
  return auth.type === "service_http";
};

// typeguard for ManifestOAuthAuth

export const isManifestOAuthAuth = (
  auth: ManifestAuth
): auth is ManifestOAuthAuth => {
  return auth.type === "oauth";
};
export interface ManifestOAuthAuth extends BaseManifestAuth {
  type: "oauth";
  instructions: string;
  client_url: string; // "https://nla.zapier.com/oauth/authorize/",
  scope: string; // "nla:exposed_actions:execute",
  authorization_url: string; //"https://nla.zapier.com/oauth/token/",
  authorization_content_type: string; // "application/x-www-form-urlencoded",
  verification_tokens: {
    openai: string;
  };
}

type ManifestAuth =
  | ManifestNoAuth
  | ManifestServiceHttpAuth
  | ManifestOAuthAuth;
// todo: add the http auth

interface OpenApiSpecification {}

export interface PluginManifest {
  schema_version: string;
  name_for_model: string;
  name_for_human: string;
  description_for_model: string;
  description_for_human: string;
  auth: ManifestAuth;
  api: OpenApiSpecification;
  logo_url: string;
  contact_email: string;
  legal_info_url: string;
}

// api schema
const apiSchema = z.object({
  openapi: z.string(),
  info: z.object({
    title: z.string(),
  }),
  url: z.string(),
});

// authSchema can be many types
const authSchema = z.union([
  z.object({
    type: z.literal("none"),
    instructions: z.optional(z.string()),
  }),
  z.object({
    type: z.literal("service_http"),
    instructions: z.optional(z.string()),
  }),
  z.object({
    type: z.literal("oauth"),
    instructions: z.optional(z.string()),
    client_url: z.string(),
    scope: z.string(),
    authorization_url: z.string(),
    authorization_content_type: z.string(),
    verification_tokens: z.object({
      openai: z.string(),
    }),
  }),
]);

export const manifestSchema = z.object({
  schema_version: z.string(),
  name_for_model: z.string(),
  name_for_human: z.string(),
  description_for_model: z.string(),
  description_for_human: z.string(),
  auth: authSchema,
  api: apiSchema,
  logo_url: z.string(),
  contact_email: z.string(),
  legal_info_url: z.string(),
});

const pluginSchema = z.object({
  id: z.string(),
  name: z.string(),
  installed: z.boolean(),
  manifest: manifestSchema,
});

export type Plugin = z.infer<typeof pluginSchema>;

// a nextjs handler
const allPlugins = pluginsJson.map((plugin) => {
  const { name, manifest } = plugin;
  return {
    name: name,
    installed: false,
    manifest,
  };
});

export const getPluginById = async (id: string): Promise<Plugin> => {
  const plugin = allPlugins.find((plugin) => plugin.id === id);

  return plugin as Plugin;
};

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
