import React, { useState, useEffect } from 'react';
import JoinRoom from './components/JoinRoom';
import ChatRoom from './components/ChatRoom';

function App() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [existingRoomId, setExistingRoomId] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a room ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    if (roomId) {
      setExistingRoomId(roomId);
    }
  }, []);

  const handleJoinRoom = (roomId: string, displayName: string) => {
    setCurrentRoom(roomId);
    setUsername(displayName);
    
    // Update URL with room ID
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('room', roomId);
    window.history.pushState({}, '', newUrl);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setUsername('');
    
    // Remove room ID from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('room');
    window.history.pushState({}, '', newUrl);
  };

  if (currentRoom && username) {
    return <ChatRoom roomId={currentRoom} username={username} />;
  }

  return <JoinRoom onJoinRoom={handleJoinRoom} existingRoomId={existingRoomId} />;
}

export default App;