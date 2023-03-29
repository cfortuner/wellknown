import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SearchResult from "./SearchResult";

const PluginSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [plugins, setPlugins] = useState([]);
  const [filteredPlugins, setFilteredPlugins] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchPlugins = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/plugins?search=${searchTerm}`);
        const data = await response.json();
        setPlugins(data.plugins);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchTerm) {
      fetchPlugins();
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      //@ts-ignore
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length === 0) {
      setFilteredPlugins([]);
      return;
    }

    const filtered = plugins.filter((plugin) =>
      //@ts-ignore
      plugin.manifest.name_for_human
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );
    setFilteredPlugins(filtered);
  };

  const router = useRouter();
  const handlePluginClick = (pluginName: string) => {
    setSearchTerm(pluginName);
    setShowDropdown(false);

    // set the plugin in the url

    router.push(`/plugin/${pluginName}`);
  };

  const inputRef = useRef<any>(null);

  return (
    <div className="container relative pt-8" ref={wrapperRef}>
      <div className="relative">
        {isLoading && (
          <span className="daisy-loading">
            <i className="fas fa-spinner fa-spin"></i>
          </span>
        )}
        <input
          ref={inputRef}
          className="daisy-input-ghost w-full rounded border border-gray-300 p-2 "
          style={{ textTransform: "none" }}
          placeholder="Search Plugins"
          value={searchTerm}
          autoComplete="off"
          autoCorrect="off"
          onChange={handleSearchChange}
          onClick={() => setShowDropdown(true)}
        />
      </div>

      {!!searchTerm.length && showDropdown && (
        <div
          className="dropdown absolute z-10 mt-[1.5px] w-full rounded-b border border-gray-300 bg-white"
          style={{
            width: inputRef.current?.offsetWidth,
          }}
        >
          {isLoading ? (
            <div className="p-2 text-center">
              <i className="loading"></i> Loading...
            </div>
          ) : filteredPlugins.length > 0 ? (
            filteredPlugins.map((plugin: any) => (
              <SearchResult
                key={plugin.id}
                plugin={plugin}
                onClick={handlePluginClick}
              />
            ))
          ) : (
            <div className="p-2 text-center">No plugins found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PluginSearch;
