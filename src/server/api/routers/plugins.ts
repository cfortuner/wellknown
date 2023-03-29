import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import plugins from "../../../initial-plugins.json";

export interface Plugin {
  id: string;
  name: string;
  installed: boolean;
  manifest: PluginManifest;
}

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
  instructions: string;
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
  // | ManifestUserHttpAuth
  | ManifestOAuthAuth;

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

export const pluginsRouter = createTRPCRouter({
  getPlugins: publicProcedure.query(() => {
    return {
      plugins: plugins,
    };
  }),
});
