import { Chat } from "~/components/Chat";

const ChatPage: React.FC = () => {
  return (
    <main className="h-screen">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-3 py-16">
        <section className="flex h-full w-full flex-col gap-3">
          <div className="flex h-full w-full justify-between space-x-4">
            <Chat />
          </div>
        </section>
      </div>
    </main>
  );
};

export default ChatPage;
