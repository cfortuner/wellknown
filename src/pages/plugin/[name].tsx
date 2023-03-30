import useSWR from "swr";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import SearchLayout from "~/components/SearchLayout";
import { ManifestOAuthAuth, Plugin, PluginManifest } from "~/types";
import { NextPageWithLayout } from "../_app";
import ReactMarkdown from "react-markdown";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { getPlugins } from "~/server/server";

// Assuming you have the PluginManifest type available
interface PluginPageProps {
  plugin: Plugin;
}

const tabs = ["plugin", "openapi"];

const PluginPage: NextPageWithLayout<PluginPageProps> = ({ plugin }) => {
  const manifest = plugin.manifest;

  const [activeTab, setActiveTab] = useState("plugin");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mb-20 flex flex-col px-20">
      <div className="flex flex-col space-y-2 pb-4">
        <div className="flex items-center space-x-4 ">
          <img src={plugin.manifest.logo_url} width={24} height={24} />
          <div className="text-4xl font-bold">{plugin.name}</div>
        </div>
        <div>{manifest.description_for_human}</div>
        <div className="flex space-x-4 py-2">
          <div className="daisy-badge">{manifest.schema_version}</div>
          {manifest.auth.type !== "none" && (
            <div className="daisy-badge-ghost daisy-badge">
              {manifest.auth.type}
            </div>
          )}
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
          <div className="py-2">.well-known/ai-plugin.json</div>
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
              requestInterceptor={(req) => {
                // need to send the request to my proxy url
                req.url = `/api/proxy?url=${encodeURIComponent(
                  plugin.manifest.api.url
                )}`;
                return req;
              }}
              url={`/api/proxy?url=${encodeURIComponent(
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

  const plugin = plugins.find((plugin) => plugin.name === name);

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
