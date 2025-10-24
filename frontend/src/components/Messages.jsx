import { chatStore } from "../store/chatStore";
import { authStore } from "../store/authStore";
import { useEffect, useRef } from "react";

const Messages = () => {
  const {
    selectedUser,
    getMessages,
    messages,
    listenForNewMessage,
    stopListeningForMessages,
  } = chatStore();
  const { loggedUser } = authStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) getMessages();
    listenForNewMessage();
    return () => stopListeningForMessages();
  }, [
    getMessages,
    selectedUser,
    listenForNewMessage,
    stopListeningForMessages,
  ]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 p-2">
        No messages yet.
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-md">
      {messages.map((message) =>
        message.senderId === selectedUser._id ? (
          <div className="flex items-start gap-3" key={message._id}>
            <img
              src={selectedUser.profilepic}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover shadow-md"
            />
            <div className="bg-gray-100 p-3 rounded-lg shadow-sm max-w-xs lg:max-w-md">
              <p className="text-sm text-gray-900">{message.text}</p>
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="mt-2 rounded-lg max-h-40"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-end gap-3 justify-end" key={message._id}>
            <div className="bg-blue-500 text-white p-3 rounded-lg shadow-md max-w-xs lg:max-w-md">
              <p className="text-sm">{message.text}</p>
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="mt-2 rounded-lg max-h-40"
                />
              )}
            </div>
            <img
              src={loggedUser.profilepic}
              alt="Your Avatar"
              className="w-10 h-10 rounded-full object-cover shadow-md"
            />
          </div>
        )
      )}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default Messages;
