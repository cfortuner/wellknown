import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { type ChatGPTMessage, ChatLine, LoadingChatLine } from "./ChatLine";
import { useCookies } from "react-cookie";

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Hi! I am a friendly AI assistant. Ask me anything!",
  },
];

const sysMsg: ChatGPTMessage[] = [
  {
    role: "system",
    content: `Friendly Assistant`,
  },
];

const InputMessage = ({ input, setInput, sendMessage }: any) => (
  <div className="clear-both mt-6 flex">
    <input
      type="text"
      aria-label="chat input"
      required
      className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm"
      value={input}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          sendMessage(input);
          setInput("");
        }
      }}
      onChange={(e) => {
        setInput(e.target.value);
      }}
    />
    <Button
      type="submit"
      className="ml-4 flex-none"
      onClick={() => {
        sendMessage(input);
        setInput("");
      }}
    >
      Say
    </Button>
  </div>
);

export function Chat() {
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useCookies([COOKIE_NAME]);

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7);
      setCookie(COOKIE_NAME, randomId);
    }
  }, [cookie, setCookie]);

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    setLoading(true);
    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];
    setMessages(newMessages);
    const last10messages = newMessages.slice(-10); // remember last 10 messages

    const responseMsg = { role: "assistant", content: "" };
    const allMsgs = [...newMessages];

    //@ts-ignore
    setMessages([...allMsgs, { ...responseMsg }]);

    try {
      //@ts-ignore
      await window.ai.getCompletion(
        {
          messages: [...sysMsg, ...last10messages],
        },
        {
          onStreamResult: (result: any, error: any) => {
            if (error) {
              throw error;
            }

            responseMsg.content += result.message.content;

            //@ts-ignore
            setMessages([...allMsgs, { ...responseMsg }]);
          },
        }
      );
    } catch (e) {
      setMessages([
        ...messages,
        {
          role: "assistant",
          content: "Sorry, I had an error. Please try again later.",
        },
      ]);

      console.log(e);
    }

    setLoading(false);
  };

  const messagesRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  // scroll to bottom when new message is added

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-2xl border-zinc-100 lg:border lg:p-6">
      <div className="h-full overflow-auto px-4" ref={messagesRef}>
        {messages.map(({ content, role }, index) => (
          <ChatLine key={index} role={role} content={content} />
        ))}

        {loading && <LoadingChatLine />}
      </div>

      <div>
        {messages.length < 2 && (
          <span className="clear-both mx-auto flex flex-grow text-gray-600">
            Type a message to start the conversation
          </span>
        )}
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
