import { Plugin } from "~/server/plugins";

export const PluginCard = ({ plugin }: { plugin: Plugin }) => {
  const manifest = plugin.manifest;

  return (
    <div className="grid w-full grid-cols-1 rounded-lg border-2 bg-white p-6 shadow-md lg:grid-cols-2">
      <div className="mb-6 flex items-center">
        <div className="mr-4 h-16 w-16 overflow-hidden rounded">
          <img
            src={manifest.logo_url}
            alt={manifest.name_for_human}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{manifest.name_for_human}</h1>
          <p className="text-gray-600">{manifest.description_for_human}</p>
        </div>
      </div>
      <div className="flex w-full space-x-8">
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">Schema Version</h2>
          <div>{manifest.schema_version}</div>
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">Auth</h2>
          <div>{manifest.auth.type}</div>
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">Contact</h2>
          <a
            href={`mailto:${manifest.contact_email}`}
            className="text-blue-600 underline"
          >
            {manifest.contact_email}
          </a>
        </div>
      </div>
    </div>
  );
};
