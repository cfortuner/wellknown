import Head from "next/head";
import Link from "next/link";
import { ReactElement } from "react";
import Header from "~/components/Header";
import PluginSearch from "~/components/PluginSearch";
import SearchLayout from "~/components/SearchLayout";
import { NextPageWithLayout } from "./_app";

// import initial plugins json

const Home: NextPageWithLayout = () => {
  // todo:
  // - query db for plugins
  // - add plugin form
  // - add plugin to db

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
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <SearchLayout>{page}</SearchLayout>;
};
