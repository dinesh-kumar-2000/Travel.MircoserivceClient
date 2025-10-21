import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../../common/Button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('hello') || input.includes('hi')) {
      return 'Hello! Welcome to TravelSphere. How can I assist you with your travel plans?';
    } else if (input.includes('book')) {
      return 'I can help you book hotels, flights, or tour packages. What would you like to book?';
    } else if (input.includes('cancel')) {
      return 'To cancel a booking, please go to "My Bookings" and select the booking you want to cancel.';
    } else if (input.includes('payment')) {
      return 'We accept payments via Stripe and Razorpay. All transactions are secure and encrypted.';
    } else if (input.includes('help')) {
      return 'I can help you with bookings, cancellations, payments, and general inquiries. What do you need help with?';
    } else {
      return 'Thank you for your message. Our support team will get back to you shortly. You can also call us at +1-234-567-8900.';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex h-[500px] w-[350px] flex-col rounded-lg border border-gray-300 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-lg bg-blue-600 p-4 text-white">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-400"></div>
          <h3 className="font-semibold">Travel Assistant</h3>
        </div>
        <button onClick={onClose} className="hover:text-gray-200">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`mt-1 text-xs ${
                    message.sender === 'user'
                      ? 'text-blue-100'
                      : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-gray-100 p-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
          <Button onClick={handleSend} disabled={!inputText.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
