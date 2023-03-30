import { Plugin } from "~/types";

const PluginCard = ({ plugin }: { plugin: Plugin }) => {
  return (
    <div className="z-10 cursor-pointer p-2">
      <img src={plugin.manifest.logo_url} width={24} height={24} />
      <div className="font-semibold">{plugin.name}</div>
      <div className="text-sm text-gray-600">
        {plugin.manifest.description_for_human}
      </div>
    </div>
  );
};

export default PluginCard;
