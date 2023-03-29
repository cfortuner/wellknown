import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PluginCard } from "~/components/PluginCard";
import { Plugin } from "~/server/plugins";

// import iniial plugins json

import useSWR from "swr";

const fetcher = (...args: any) => fetch(args).then((res) => res.json());

const Home: NextPage = () => {
  const { data, error, isLoading } = useSWR("/api/plugins", fetcher);

  // todo:
  // - query db for plugins
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
        <Header />
        {!data ? (
          <div className="daisy-loading" />
        ) : (
          <PluginSearch plugins={data?.plugins} />
        )}
        <div className="mt-40"></div>
      </main>
    </>
  );
};

interface PluginSearchResultProps {
  plugin: Plugin;
}

const Header = () => {
  return (
    <div className="daisy-navbar bg-base-200">
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
        </ul>
      </div>
    </div>
  );
};

const PluginSearchResult: React.FC<PluginSearchResultProps> = ({ plugin }) => {
  return (
    <Link href={`/plugin/${plugin.name}`} className="py-2">
      <PluginCard plugin={plugin} />
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

  const filteredPlugins = plugins?.filter((plugin) =>
    plugin.manifest.name_for_human
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container w-full flex-col">
      <div className="flex w-full items-end justify-around py-2 ">
        <div className="daisy-form-control w-full">
          <label className="daisy-label">
            <span className="daisy-label-text text-lg font-semibold">
              Search
            </span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            value={searchTerm}
            onChange={handleSearchChange}
            className="daisy-input-bordered daisy-input w-full max-w-lg rounded-sm"
          />
        </div>
        <div>
          <Link
            href="/submit"
            className="daisy-btn-primary daisy-btn-sm daisy-btn whitespace-nowrap"
          >
            Submit a Plugin
          </Link>
        </div>
      </div>
      {/** Search results */}
      <ul className="flex flex-col space-y-4">
        {filteredPlugins.map((plugin) => (
          <PluginSearchResult plugin={plugin} key={plugin.id} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
