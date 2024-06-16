import React, { useState } from 'react';

const VoiceBot = () => {
  const [listening, setListening] = useState(false);
  const [command, setCommand] = useState('');
  const recognition = new window.webkitSpeechRecognition(); // For Chrome, adjust for other browsers

  recognition.lang = 'en-US';

  recognition.onstart = () => {
    console.log('Speech recognition started');
    setListening(true);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('Recognized:', transcript);
    setCommand(transcript);
    respondToCommand(transcript);
  };

  const startListening = () => {
    recognition.start();
  };

  const stopListening = () => {
    recognition.stop();
    setListening(false);
  };

  const respondToCommand = (command) => {
    let response = '';
    if (command.includes('echo')) {
      const echoedText = command.replace('echo', '');
      response = echoedText.trim();
    } else if (command.includes('hello')) {
      response = 'Hello! How can I assist you?';
    } else if (command.includes('how are you')) {
      response = 'I’m just a program, but thank you for asking!';
    } else {
      response = 'I’m sorry, I didn’t catch that.';
    }
    
    speak(response);
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  return (
    <div>
      <button onClick={listening ? stopListening : startListening}>
        {listening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <p>Command: {command}</p>
    </div>
  );
};

export default VoiceBot;
