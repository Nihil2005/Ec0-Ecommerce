import React, { useState, useEffect, useRef } from 'react';
import { FaCommentAlt, FaTimes, FaMicrophone, FaStop, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hey there! I'm here to help you. Feel free to ask me anything!", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatWindowRef = useRef(null);
  const recognition = new window.webkitSpeechRecognition(); 

  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('Recognized:', transcript);
    setInputValue(transcript);
    handleSubmit(transcript);
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.223.1:800/api/productsxx/');
      const products = response.data;
      return products;
    } catch (error) {
      console.error('Error fetching products:', error.message);
      return [];
    }
  };

  const displayProductDetails = (product) => {
    return `
      Name: ${product.name}
      Price: ${product.price}
    
      
    `;
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (value) => {
    if (!value.trim()) return;

    setMessages(prevMessages => [...prevMessages, { text: value, sender: "user" }]);

    let botResponse = "I'm sorry, I don't understand.";
    if (value.toLowerCase().includes("hello")) {
      botResponse = "Hello!";
    } else if (value.toLowerCase().includes("love")) {
      botResponse = "I love you too!";
    } else if (value.toLowerCase().includes("product")) {
      const products = await fetchProducts();
      if (products.length > 0) {
        botResponse = "Sure! Here are some products:";
        products.forEach(product => {
          botResponse += `\n\n${displayProductDetails(product)}`;
        });
      } else {
        botResponse = "No products found.";
      }
    } else if (value.toLowerCase().includes("how are you")) {
      botResponse = "I'm just a bot, but thanks for asking!";
    } else if (value.toLowerCase().includes("thank you")) {
      botResponse = "You're welcome!";
    }else if (value.toLowerCase().includes("i love you")) {
      botResponse = "i love you too!";
    }else if (value.toLowerCase().includes("how to contact you")) {
      botResponse = "mail to support@ecomart.com";
    }else if (value.toLowerCase().includes("how to order")) {
      botResponse = "click the Contact Seller on WhatsApp to place order";
    } else if (value.toLowerCase().includes("bye")) {
      botResponse = "Goodbye! Feel free to reach out anytime.";
      setIsOpen(false); // Close the chatbot when user says bye
    } else if (value.toLowerCase().includes("move home page")) {
      // Add your navigation logic here
      window.location.href = '/'; // Redirect to home page
    }
    setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: "bot" }]);
    speak(botResponse); // Speak bot's response
    setInputValue('');
  };

  const speak = (text) => {
    console.log(text); // Check if the text is being correctly passed

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const startListening = () => {
    recognition.start();
  };

  const stopListening = () => {
    recognition.stop();
  };

  return (
    <div className={`fixed bottom-8 right-8 sm:bottom-4 sm:right-4 ${isOpen ? 'w-full max-w-md' : ''}`}>
      {/* Button to toggle chatbot */}
      {!isOpen && (
        <button
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow-md focus:outline-none"
          onClick={toggleChatbot}
        >
          <FaCommentAlt className="text-xl" />
        </button>
      )}

      {/* Chatbot window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg">
          {/* Chatbot header */}
          <div className="bg-green-500 text-white px-4 py-2 flex justify-between items-center">
            <h3 className="font-bold">Simple Chatbot</h3>
            <button onClick={toggleChatbot} className="focus:outline-none">
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          {/* Chatbot messages */}
          <div ref={chatWindowRef} className="p-4 overflow-y-auto max-h-96">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.sender === "bot" ? "text-gray-800" : "text-green-800 text-right"}`}>
                <p className={`bg-${message.sender === "bot" ? "gray" : "green"}-200 rounded-lg px-3 py-2 inline-block`}>{message.text}</p>
              </div>
            ))}
          </div>
          {/* Chatbot input */}
          <form onSubmit={e => { e.preventDefault(); handleSubmit(inputValue); }} className="bg-gray-100 p-4 flex">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-white border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white rounded-r-lg px-4 py-2 ml-2"
              onClick={startListening}
            >
              <FaMicrophone />
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white rounded-r-lg px-4 py-2 ml-2"
            >
              <FaPaperPlane />
            </button>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white rounded-r-lg px-4 py-2 ml-2"
              onClick={stopListening}
            >
              <FaStop />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
