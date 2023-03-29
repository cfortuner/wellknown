import useSWR from "swr";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import SearchLayout from "~/components/SearchLayout";
import {
  getPlugins,
  ManifestOAuthAuth,
  Plugin,
  PluginManifest,
} from "~/server/plugins";
import { NextPageWithLayout } from "../_app";
import ReactMarkdown from "react-markdown";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

// Assuming you have the PluginManifest type available
interface PluginPageProps {
  plugin: Plugin;
  name: any;
}

const tabs = ["plugin", "openapi"];

const PluginPage: NextPageWithLayout<PluginPageProps> = ({ plugin, name }) => {
  const manifest = plugin.manifest;
  //@ts-ignore
  const openapiurl = plugin.manifest.api.url;

  // todo:
  // - readme
  // - install instructions
  // - openapi schema
  // - plugin settings
  // - auth settings
  // - plugin statu
  const [activeTab, setActiveTab] = useState("plugin");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="container flex flex-col px-20">
      <div className="flex flex-col space-y-2 pb-4">
        <div className="flex items-center space-x-4 ">
          <img src={plugin.manifest.logo_url} width={24} height={24} />
          <div className="text-4xl font-bold">{plugin.name}</div>
        </div>
        <div>{manifest.description_for_human}</div>
        <div className="flex space-x-4">
          <div>{manifest.schema_version}</div>
          <div>{manifest.auth.type}</div>
          <div>{manifest.contact_email.includes("@") || ""}</div>
        </div>
      </div>
      <div className="daisy-tabs pb-4">
        {tabs.map((tab) => (
          <a
            key={tab}
            className={`daisy-tab daisy-tab-bordered daisy-tab-lg ${
              tab === activeTab ? "daisy-tab-active" : ""
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </a>
        ))}
      </div>
      {activeTab === "plugin" && (
        <div>
          <div className="py-2">/.well-known/ai-plugin.json</div>
          <ReactMarkdown className="overflow-auto border-2 p-4">
            {"```\n" + JSON.stringify(plugin.manifest, null, 2) + "\n```"}
          </ReactMarkdown>
        </div>
      )}
      {activeTab === "openapi" && (
        <div>
          <div className="py-2">OpenAPISpec</div>
          <div className="border-2">
            <SwaggerUI
              //@ts-ignore
              url={`/api/proxy?url=${encodeURIComponent(
                //@ts-ignore
                plugin.manifest.api.url
              )}`}
              docExpansion="full"
              defaultModelsExpandDepth={0}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name = decodeURIComponent(context.params?.["name"] as string);

  const plugins = await getPlugins(name);

  const plugin =
    plugins.find((plugin) => plugin.manifest.name_for_human === name) || {};

  return {
    props: {
      name,
      plugin,
    },
  };
};

export default PluginPage;
PluginPage.getLayout = function getLayout(page: ReactElement) {
  return <SearchLayout>{page}</SearchLayout>;
};

// todo: remove when we have a better way to get the API schema
const api = {
  openapi: "3.0.1",
  info: {
    title: "Shop",
    description:
      "Search for millions of products from the world's greatest brands.",
    version: "v1",
  },
  servers: [
    {
      url: "https://server.shop.app",
    },
  ],
  paths: {
    "/openai/search": {
      get: {
        operationId: "search",
        summary: "Search for products",
        parameters: [
          {
            in: "query",
            name: "query",
            description: "Query string to search for items.",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            in: "query",
            name: "price_min",
            description: "The minimum price to filter by.",
            required: false,
            schema: {
              type: "number",
            },
          },
          {
            in: "query",
            name: "price_max",
            description: "The maximum price to filter by.",
            required: false,
            schema: {
              type: "number",
            },
          },
          {
            in: "query",
            name: "similar_to_id",
            description:
              "A product id that you want to find similar products for. (Only include one)",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            in: "query",
            name: "num_results",
            description:
              "How many results to return. Defaults to 5. It can be a number between 1 and 10.",
            required: false,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/searchResponse",
                },
              },
            },
          },
          "503": {
            description: "Service Unavailable",
          },
        },
      },
    },
    "/openai/details": {
      get: {
        operationId: "details",
        summary: "Return more details about a list of products.",
        parameters: [
          {
            in: "query",
            name: "ids",
            description: "Comma separated list of product ids",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/searchResponse",
                },
              },
            },
          },
          "503": {
            description: "Service Unavailable",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      searchResponse: {
        type: "object",
        properties: {
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "The title of the product",
                },
                price: {
                  type: "number",
                  format: "string",
                  description: "The price of the product",
                },
                currency_code: {
                  type: "string",
                  description: "The currency that the price is in",
                },
                url: {
                  type: "string",
                  description: "The url of the product page for this product",
                },
                description: {
                  type: "string",
                  description: "The description of the product",
                },
              },
              description: "The list of products matching the search",
            },
          },
        },
      },
    },
  },
};
