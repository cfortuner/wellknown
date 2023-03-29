import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { PluginCard } from "~/components/PluginCard";
import { getPlugins, Plugin } from "~/server/plugins";

// Assuming you have the PluginManifest type available
interface PluginPageProps {
  plugin: Plugin;
}

const PluginPage: React.FC<PluginPageProps> = ({ plugin }) => {
  const manifest = plugin.manifest;

  const router = useRouter();

  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBackButtonClick}
        className="mb-4 text-blue-600 underline"
      >
        &larr; Back
      </button>
      <PluginCard plugin={plugin} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name = context.params?.["name"];

  const plugins = await getPlugins();

  const plugin = plugins.find((plugin) => plugin.name === name);

  return {
    props: {
      plugin,
    },
  };
};

export default PluginPage;
