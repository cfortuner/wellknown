import { ReactElement } from "react";
import Header from "./Header";
import PluginSearch from "./PluginSearch";

const SearchLayout = ({ children }: { children: ReactElement }) => {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      <div className="w-full">
        <Header />
        <div className="mx-20 pb-8">
          <PluginSearch />
        </div>
      </div>
      {children}
    </main>
  );
};

export default SearchLayout;
