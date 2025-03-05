import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:3001');

interface MessageData {
  message: string;
}

export default function App() {
  const [message, setMessage] = useState<string>('');
  const [receivedMessage, setReceivedMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  function sendMessage() {
    if (message.trim()) {
      socket.emit('send_message', { message: message });
      setMessage(''); // Clear input after sending
    }
  }

  useEffect(() => {
    // Connection status handlers
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    // Message handler
    socket.on('receive_message', (data: MessageData) => {
      setReceivedMessage(data.message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive_message');
    };
  }, []);

  return (
    <div className="container">
      <div style={{ marginBottom: '10px' }}>Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}</div>
      <input
        placeholder="write message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button type="button" onClick={sendMessage} disabled={!isConnected || !message.trim()}>
        Send a message
      </button>
      <div
        style={{ background: '#ddd', padding: '10px', width: '300px', minHeight: '100px', border: '1px solid black' }}
      >
        {receivedMessage || <span style={{ color: '#aaa' }}>No messages yet</span>}
      </div>
    </div>
  );
}
