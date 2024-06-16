import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './auth/LoginComponent';
import SignupComponent from './auth/SignupComponent';
import EmailActivationComponent from './auth/EmailActivationComponent';
import Home from './pages/Home';
import AddProductForm from './auth/ProfileComponent';
import ProductDetail from './pages/ProductDetail';
import Navbar from './pages/Navbar';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage ';
import User2SignupComponent from './auth/User2SignupComponent';
import LandingPage from './pages/inedexpage';
import FAQPage from './pages/Faq';
import Chatbot from './Bot/Ai_chat_bot';

const App = () => {
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setInputValue(transcript);
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.start(); // Start listening for voice commands when component mounts

    return () => {
      recognition.stop();
    };
  }, []);

  const handleVoiceCommand = (command) => {
    console.log('Voice command:', command);

    // Convert command to lowercase for easier comparison
    const lowerCaseCommand = command.toLowerCase();

    // Check if the command contains certain keywords and perform actions accordingly
    if (lowerCaseCommand.includes('hello')) {
      speakResponse("Hello! How can I assist you?");
    } else if (lowerCaseCommand.includes('login') || lowerCaseCommand.includes('log in')) {
      return <Navigate to="/login" />;
    } else if (lowerCaseCommand.includes('signup') || lowerCaseCommand.includes('sign up')) {
      return <Navigate to="/signup" />;
    } else if (lowerCaseCommand.includes('activate')) {
      return <Navigate to="/activate" />;
    } else if (lowerCaseCommand.includes('profile')) {
      return <Navigate to="/profile" />;
    } else if (lowerCaseCommand.includes('about us')) {
      return <Navigate to="/about-us" />;
    } else if (lowerCaseCommand.includes('contact us')) {
      return <Navigate to="/contact-us" />;
    } else if (lowerCaseCommand.includes('user sign up') || lowerCaseCommand.includes('user signup')) {
      return <Navigate to="/usersinup" />;
    }else if (lowerCaseCommand.includes('i love you')) {
      speakResponse("i love you too");
    }else if (lowerCaseCommand.includes('how are you')) {
      speakResponse(" i am fine and how are you");
    }else if (lowerCaseCommand.includes('who build you')) {
      speakResponse("i was build by nihil , jeeva and ansari");
    }else {
      // Respond with a generic message for unrecognized commands
      speakResponse("Sorry, I couldn't understand that command.");
    }
  };

  const speakResponse = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        {isBotOpen && (
          <div className="bot-container">
            {/* Render your chatbot component here */}
          </div>
        )}

        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/signup" element={<SignupComponent />} />
          <Route path="/activate" element={<EmailActivationComponent />} />
          <Route path="/profile" element={<AddProductForm />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/usersinup" element={<User2SignupComponent />} />
          <Route path='/faq' element={<FAQPage/>} />
          <Route path='/aiachatbot'  element={<Chatbot />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
