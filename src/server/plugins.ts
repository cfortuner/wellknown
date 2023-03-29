import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import * as z from "zod";

import pluginsJson from "../initial-plugins.json";

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

interface ManifestOAuthAuth extends BaseManifestAuth {
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

interface PluginManifest {
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

const manifestSchema = z.object({
  schema_version: z.string(),
  name_for_model: z.string(),
  name_for_human: z.string(),
  description_for_model: z.string(),
  description_for_human: z.string(),
  auth: authSchema,
  api: z.object({}),
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

export const getPlugins = async (): Promise<Plugin[]> => {
  const plugins = Object.entries(pluginsJson).map(([id, manifest]) => {
    return {
      id: uuid(),
      name: manifest.name_for_model,
      installed: false,
      manifest,
    };
  }) as Plugin[];

  return plugins;
};
