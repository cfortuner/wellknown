// src/pages/submit.tsx
import React, { useState } from "react";
import { manifestSchema } from "~/server/plugins";

const submitPlugin = async (name: string, manifestFile: File) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("manifest", manifestFile);

  const response = await fetch("/api/submit", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data;
};

const SubmitPluginPage: React.FC = () => {
  const [name, setName] = useState("");
  const [manifestFile, setManifestFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setManifestFile(file);
    }
  };

  const validateManifest = async (file: File): Promise<boolean> => {
    // Perform your validation logic here. This example assumes that the manifest is a JSON file.
    try {
      const fileContent = await file.text();
      const manifest = JSON.parse(fileContent);

      // Validate the manifest content according to your requirements
      manifestSchema.parse(manifest);

      setValidationError(null);
      return true;
    } catch (error) {
      setValidationError(
        "Invalid manifest file " + JSON.stringify(error, undefined, 4)
      );
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!manifestFile) {
      setValidationError("Please upload a manifest file");
      return;
    }

    if (!name) {
      setValidationError("Please enter a name for your plugin.");
      return;
    }

    const isValid = await validateManifest(manifestFile);
    if (isValid) {
      // Send the name and manifestFile to your backend to store in the database
      // ...
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-semibold">Submit Plugin</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="manifestFile" className="mb-1 block">
            Manifest File
          </label>
          <input
            type="file"
            id="manifestFile"
            onChange={handleFileChange}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
        >
          Submit
        </button>
        {validationError && (
          <div className="h-[400px] overflow-y-scroll">
            <pre className="text-red-600">{validationError}</pre>
          </div>
        )}
      </form>
    </div>
  );
};

export default SubmitPluginPage;
