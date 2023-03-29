import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Plugin } from "~/server/api/routers/plugins";

// import iniial plugins json

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { data, isLoading } = api.plugins.getPlugins.useQuery();

  // todo:
  // - query db for plugins

  // - display plugins

  // - add plugin form

  // - add plugin to db

  return (
    <>
      <Head>
        <title>AI Plugins API</title>
        <meta name="description" content="Add plugins to your registry!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-white">
        {/** HEADER */}
        <div className="daisy-navbar bg-base-100">
          <div className="flex-1">
            <a className="daisy-btn-ghost daisy-btn text-xl normal-case">
              AI Plugins
            </a>
          </div>
          <div className="flex-none">
            <ul className="daisy-menu daisy-menu-horizontal px-1">
              <li>
                <a>About</a>
              </li>
              {/** discord icon and link */}
              <li>
                <a>Discord</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading ? (
          <div className="daisy-loading" />
        ) : (
          <PluginSearch plugins={data!.plugins} />
        )}
        <div>Add a plugin</div>
      </main>
    </>
  );
};

interface PluginSearchResultProps {
  plugin: Plugin;
}

const PluginSearchResult: React.FC<PluginSearchResultProps> = ({ plugin }) => {
  return (
    <Link href={`/plugin/${plugin.id}`} className="text-black no-underline">
      <div className="mb-4 flex flex-col rounded border border-gray-300 p-4 shadow-md">
        <div className="mb-2 flex items-center">
          <div className="mr-4 h-12 w-12 overflow-hidden rounded">
            <img
              src={plugin.manifest.logo_url}
              alt={plugin.manifest.name_for_human}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="m-0 mb-1">{plugin.manifest.name_for_human}</h2>
            <p className="m-0 text-gray-600">
              {plugin.manifest.description_for_human}
            </p>
          </div>
        </div>
        <div className="mb-2">
          <a
            href={`mailto:${plugin.manifest.contact_email}`}
            className="text-blue-600 no-underline"
          >
            Contact: {plugin.manifest.contact_email}
          </a>
        </div>
        <div className="text-right">
          <a
            href={plugin.manifest.legal_info_url}
            className="text-blue-600 no-underline"
          >
            Legal Info
          </a>
        </div>
      </div>
    </Link>
  );
};

interface PluginSearchProps {
  plugins: Plugin[];
}

const PluginSearch: React.FC<PluginSearchProps> = ({ plugins }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlugins = plugins.filter((plugin) =>
    plugin.manifest.name_for_human
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container w-full">
      <div className="daisy-form-control">
        <label className="daisy-label">
          <span className="daisy-label-text text-lg font-semibold">Search</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          value={searchTerm}
          onChange={handleSearchChange}
          className="daisy-input-bordered daisy-input w-full max-w-lg rounded-sm"
        />
      </div>
      {/** Search results */}
      {filteredPlugins.map((plugin) => (
        <PluginSearchResult plugin={plugin} />
      ))}
    </div>
  );
};

export default Home;
