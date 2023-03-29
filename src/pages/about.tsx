const AboutPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8 ">
            <h1 className="text-5xl font-bold">About</h1>
            <p className="py-6">AI Plugins allows you to search for chat plugins compatible with <a className="daisy-link" href="https://platform.openai.com/docs/plugins/introduction">OpenAI's Chat Plugin Spec</a></p>
            <p>Give your chatbot superpowers! Works with any chatbot that implements the ChatGPT Plugin manifest</p>
        </div>
    )
}

export default AboutPage;