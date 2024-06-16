import React, { useState } from 'react';

const API_KEY = "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";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm EcoChat Ask me anything!",
      sentTime: "just now",
      sender: "EcoChat"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      sentTime: new Date().toLocaleString(),
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "EcoChat") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message }
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience." },
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sentTime: new Date().toLocaleString(),
        sender: "EcoChat"
      }]);
      setIsTyping(false);
    });
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md border-dotted border-4 rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col h-screen">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, i) => (
              <div key={i} className={`flex flex-col mb-4 ${message.sender === "EcoChat" ? "items-end" : "items-start"}`}>
                <p className={`text-sm mb-1 ${message.sender === "EcoChat" ? "text-right" : ""}`}>{message.sender}</p>
                <div className={`p-3 rounded-lg ${message.sender === "EcoChat" ? "bg-blue-100" : "bg-gray-100"}`}>
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))}
            {isTyping && <p className="text-gray-500 text-sm text-right">EcoChat is typing...</p>}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(e.target.message.value); e.target.message.value = ""; }} className="p-4">
            <input type="text" name="message" placeholder="Type message here" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500" />
            <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-gren-600 focus:outline-none focus:bg-blue-600">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chatbot;
