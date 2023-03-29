import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

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
        <div className="container w-full">
          <div className="daisy-form-control">
            <label className="daisy-label">
              <span className="daisy-label-text text-lg font-semibold">
                Search
              </span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="daisy-input-bordered daisy-input w-full max-w-lg rounded-sm"
            />
          </div>
        </div>
        <div>Add a plugin</div>
      </main>
    </>
  );
};

export default Home;
