import React, { useState } from 'react';
import './App.css';
import jagathyGif from './assets/jagathy.gif'; // bot avatar
import userAvatar from './assets/sreenivasan.gif'; // user avatar

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'സുഖമാണോ കണ്മണി?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMsg = {
        sender: 'bot',
        text: data.reply || 'Sorry, ente net slow ayi!'
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Server error da, innale pole.' }
      ]);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-container">
      <h1 className="title">PODA AI 🤖🔥</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'bot' ? 'bot' : 'user'}`}
          >
            {msg.sender === 'bot' && (
              <img src={jagathyGif} alt="Bot" className="character-img" />
            )}
            <span>{msg.text}</span>
            {msg.sender === 'user' && (
              <img src={userAvatar} alt="User" className="character-img" />
            )}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="ചോദിക്കടെ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSend}>പറയിക്കൂ</button>
      </div>
    </div>
  );
}

export default App;
