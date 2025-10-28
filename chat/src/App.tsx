import { useState } from 'react';
import { Button, Card, Input, Badge } from 'host';
import './App.css';

// TypeScript interfaces
interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
}

interface MessagesMap {
  [conversationId: number]: Message[];
}

// Mock chat data
const initialConversations: Conversation[] = [
  { id: 1, name: 'John Doe', lastMessage: 'Hey, how are you?', time: '10:30 AM', unread: 2, avatar: '👨' },
  { id: 2, name: 'Jane Smith', lastMessage: 'Meeting at 3 PM?', time: '09:15 AM', unread: 0, avatar: '👩' },
  { id: 3, name: 'Team Chat', lastMessage: 'Project update available', time: 'Yesterday', unread: 5, avatar: '👥' },
  { id: 4, name: 'Sarah Wilson', lastMessage: 'Thanks for the help!', time: 'Yesterday', unread: 0, avatar: '👩‍💼' },
];

const initialMessages: MessagesMap = {
  1: [
    { id: 1, sender: 'John Doe', text: 'Hey, how are you?', time: '10:25 AM', isOwn: false },
    { id: 2, sender: 'You', text: 'I am good! How about you?', time: '10:27 AM', isOwn: true },
    { id: 3, sender: 'John Doe', text: 'Doing great! Want to discuss the project?', time: '10:30 AM', isOwn: false },
  ],
  2: [
    { id: 1, sender: 'Jane Smith', text: 'Hi! Can we have a meeting?', time: '09:10 AM', isOwn: false },
    { id: 2, sender: 'You', text: 'Sure, what time?', time: '09:12 AM', isOwn: true },
    { id: 3, sender: 'Jane Smith', text: 'Meeting at 3 PM?', time: '09:15 AM', isOwn: false },
  ],
  3: [
    { id: 1, sender: 'Mike Johnson', text: 'Team, we have a new update!', time: '2:00 PM', isOwn: false },
    { id: 2, sender: 'Sarah Wilson', text: 'What is it about?', time: '2:05 PM', isOwn: false },
    { id: 3, sender: 'You', text: 'Please share the details', time: '2:07 PM', isOwn: true },
    { id: 4, sender: 'Mike Johnson', text: 'Project update available', time: '2:10 PM', isOwn: false },
  ],
  4: [
    { id: 1, sender: 'You', text: 'Hey Sarah, need any help?', time: '11:00 AM', isOwn: true },
    { id: 2, sender: 'Sarah Wilson', text: 'Yes, with the code review', time: '11:15 AM', isOwn: false },
    { id: 3, sender: 'You', text: 'I will help you!', time: '11:20 AM', isOwn: true },
    { id: 4, sender: 'Sarah Wilson', text: 'Thanks for the help!', time: '11:45 AM', isOwn: false },
  ],
};

function ChatApp() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<number>(1);
  const [messages, setMessages] = useState<MessagesMap>(initialMessages);
  const [newMessage, setNewMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');


  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages[selectedConversation].length + 1,
        sender: 'You',
        text: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };

      setMessages(prev => ({
        ...prev,
        [selectedConversation]: [...prev[selectedConversation], message]
      }));

      // Update conversation last message
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation
          ? { ...conv, lastMessage: newMessage, time: 'Just now' }
          : conv
      ));

      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages[selectedConversation] || [];

  return (
    <div className="chat-app">
      <Card title="Chat Application">
        <div className="chat-container">
          {/* Conversations List */}
          <div className="conversations-panel">
            <div className="conversations-header">
              <h3>Messages</h3>
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
            <div className="conversations-list">
              {filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  className={`conversation-item ${conv.id === selectedConversation ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conv.id)}
                >
                  <div className="conversation-avatar">{conv.avatar}</div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <span className="conversation-name">{conv.name}</span>
                      <span className="conversation-time">{conv.time}</span>
                    </div>
                    <div className="conversation-preview">
                      <span className="conversation-last-message">{conv.lastMessage}</span>
                      {conv.unread > 0 && (
                        <Badge variant="danger">{conv.unread}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="messages-panel">
            <div className="messages-header">
              <div className="conversation-avatar">{currentConversation?.avatar}</div>
              <div>
                <h3>{currentConversation?.name}</h3>
                <span className="status">Active now</span>
              </div>
            </div>

            <div className="messages-list">
              {currentMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`message ${msg.isOwn ? 'message-own' : 'message-other'}`}
                >
                  <div className="message-content">
                    {!msg.isOwn && <strong>{msg.sender}</strong>}
                    <p>{msg.text}</p>
                    <span className="message-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="message-input-container">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                fullWidth
              />
              <Button onClick={handleSendMessage} variant="primary">
                Send
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="chat-info">
        <p>This is a standalone Chat micro-frontend consuming Design System from Host</p>
        <Badge variant="primary">Micro-Frontend</Badge>
      </div>
    </div>
  );
}

export default ChatApp;
