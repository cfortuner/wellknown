import Head from "next/head";
import Link from "next/link";
import { ReactElement } from "react";
import Header from "~/components/Header";
import PluginSearch from "~/components/PluginSearch";
import SearchLayout from "~/components/SearchLayout";
import { NextPageWithLayout } from "./_app";
import useSWR from "swr";
import PluginCard from "~/components/PluginCard";

// import initial plugins json

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const Home: NextPageWithLayout = () => {
  const { data, isLoading } = useSWR("/api/plugins", fetcher);

  return (
    <>
      <Head>
        <title>Wellknown</title>
        <meta
          name="description"
          content="Wellknown is a registry for AI Plugins"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading || !data.plugins ? (
        <div>Loading...</div>
      ) : (
        <div
          className={`container grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}
        >
          {data.plugins?.map((plugin: any) => (
            <div
              key={plugin.name}
              className={`rounded-lg border bg-white p-4 hover:border-primary`}
            >
              <Link href={`/plugin/${plugin.name}`}>
                <PluginCard plugin={plugin} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <SearchLayout>{page}</SearchLayout>;
};
