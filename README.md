# Plugins API

What is this?

This is a directory of AI Plugins as defined by https://openai.com/blog/chatgpt-plugins#browsing

With the release of chatGPT plugins, developers can now publish `ai-plugin.json` manifest files alongside their APIs which chatGPT and other LLMs can use to interact with the api in natural language.

This enables ai modesl to use 'tools' to fetch and store data, take actions and listen for events.

# Goals

The main goal for this project is to be like npm for ai agents.

LLM's will eventually need to be able to find the right tools to complete a task, even if they haven't been installed by the user.

This app will provide a search api and a admin ui for managing plugins.

# TODO
