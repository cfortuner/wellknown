import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { PluginCard } from "~/components/PluginCard";
import { getPlugins, Plugin } from "~/server/plugins";

// Assuming you have the PluginManifest type available
interface PluginPageProps {
  plugin: Plugin;
}

const PluginPage: React.FC<PluginPageProps> = ({ plugin }) => {
  const manifest = plugin.manifest;

  const router = useRouter();

  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBackButtonClick}
        className="mb-4 text-blue-600 underline"
      >
        &larr; Back
      </button>
      <PluginCard plugin={plugin} />

      <div className="flex flex-col justify-center items-center p-16 mt-8 gap-8 bg-white rounded-lg shadow-md border-2">
        <div className="flex flex-row gap-8 items-center">
          <div>
            {/* <h1 className="text-5xl font-bold ">{api.info.title}</h1>
            <p className="py-6">{api.info.description}</p> */}
            <a className="daisy-link daisy-link-primary" href="https://server.shop.app/openai/v1/api.json">Link to API Schema</a>
          </div>
          <div className="overflow-x-auto">
            <table className="daisy-table w-full">
              {/* head */}
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Name</th>
                  <th>Summary</th>
                  {/* <th>Parameters</th> */}
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <td>/openai/search</td>
                  <td>{api.paths["/openai/search"].get.operationId}</td>
                  <td>{api.paths["/openai/search"].get.summary}</td>
                  {/* <td className="overflow-x-scroll">{api.paths["/openai/search"].get.parameters.map((param) => param.name).join(", ")}</td> */}
                </tr>
                {/* row 2 */}
                <tr>
                  <td>/openai/details</td>
                  <td>{api.paths["/openai/details"].get.operationId}</td>
                  <td>{api.paths["/openai/details"].get.summary}</td>
                  {/* <td className="overflow-x-scroll">{api.paths["/openai/details"].get.parameters.map((param) => param.name).join(", ")}</td> */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name = context.params?.["name"];

  const plugins = await getPlugins();

  const plugin = plugins.find((plugin) => plugin.name === name);

  return {
    props: {
      plugin,
    },
  };
};

export default PluginPage;

// todo: remove when we have a better way to get the API schema
const api = {
  "openapi": "3.0.1",
  "info": {
    "title": "Shop",
    "description": "Search for millions of products from the world's greatest brands.",
    "version": "v1"
  },
  "servers": [
    {
      "url": "https://server.shop.app"
    }
  ],
  "paths": {
    "/openai/search": {
      "get": {
        "operationId": "search",
        "summary": "Search for products",
        "parameters": [
          {
            "in": "query",
            "name": "query",
            "description": "Query string to search for items.",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "price_min",
            "description": "The minimum price to filter by.",
            "required": false,
            "schema": {
              "type": "number"
            }
          },
          {
            "in": "query",
            "name": "price_max",
            "description": "The maximum price to filter by.",
            "required": false,
            "schema": {
              "type": "number"
            }
          },
          {
            "in": "query",
            "name": "similar_to_id",
            "description": "A product id that you want to find similar products for. (Only include one)",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "num_results",
            "description": "How many results to return. Defaults to 5. It can be a number between 1 and 10.",
            "required": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/searchResponse"
                }
              }
            }
          },
          "503": {
            "description": "Service Unavailable"
          }
        }
      }
    },
    "/openai/details": {
      "get": {
        "operationId": "details",
        "summary": "Return more details about a list of products.",
        "parameters": [
          {
            "in": "query",
            "name": "ids",
            "description": "Comma separated list of product ids",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/searchResponse"
                }
              }
            }
          },
          "503": {
            "description": "Service Unavailable"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "searchResponse": {
        "type": "object",
        "properties": {
          "results": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string",
                  "description": "The title of the product"
                },
                "price": {
                  "type": "number",
                  "format": "string",
                  "description": "The price of the product"
                },
                "currency_code": {
                  "type": "string",
                  "description": "The currency that the price is in"
                },
                "url": {
                  "type": "string",
                  "description": "The url of the product page for this product"
                },
                "description": {
                  "type": "string",
                  "description": "The description of the product"
                }
              },
              "description": "The list of products matching the search"
            }
          }
        }
      }
    }
  }
}