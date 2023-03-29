const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-5xl font-bold">About</h1>
      <p className="py-6">
        Wellknown is a AI Plugin Registry trying to help create an open standard
        for plugins on the web. We are building a registry of plugins that
        follow the standard published by{" "}
        <a
          className="daisy-link"
          href="https://platform.openai.com/docs/plugins/introduction"
        >
          OpenAI's Chat Plugin Spec.
        </a>
      </p>
      <p>
        The goal of this project is to empower developers to build and use
        plugins in their ai applications. By creating a registry of plugins we
        hope to create a community of developers that can share their plugins
        and collaborate on new ones.
      </p>
      <br></br>
      <p>Wellknown</p>
    </div>
  );
};

export default AboutPage;
