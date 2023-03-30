const SearchResult = ({ plugin, onClick }: any) => (
  <div
    className="z-10 cursor-pointer border-b border-gray-300 p-2 hover:bg-gray-200"
    onClick={() => onClick(plugin.name)}
  >
    <div className="font-semibold">{plugin.name}</div>
    <div className="text-sm text-gray-600">
      {plugin.manifest.description_for_human}
    </div>
  </div>
);

export default SearchResult;
