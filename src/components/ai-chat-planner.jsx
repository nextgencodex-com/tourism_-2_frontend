import React, { useState, useRef, useEffect } from 'react';
import { generateTripPlan } from '../services/aiTripPlannerService';
import '../styles/ai-chat.css';

const AIChatPlanner = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI Travel Planner. How can I help you plan your perfect trip to Sri Lanka today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Call AI API
      const response = await generateTripPlan(inputValue);
      
      // Add AI response to chat
      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: response?.response || response?.message || JSON.stringify(response),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message);
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h2>AI Trip Planner</h2>
        <p>Plan your Sri Lankan adventure with AI assistance</p>
      </div>

      <div className="ai-chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`ai-message ai-message-${message.role}`}>
            <div className={`ai-message-content ${message.isError ? 'error' : ''}`}>
              {message.content}
            </div>
            <span className="ai-message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="ai-message ai-message-assistant loading">
            <div className="ai-message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="ai-chat-error">{error}</div>}

      <form onSubmit={handleSendMessage} className="ai-chat-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me about travel plans, destinations, activities..."
          disabled={isLoading}
          className="ai-chat-input"
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()} className="ai-chat-submit">
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default AIChatPlanner;
