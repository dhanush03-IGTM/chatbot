import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, Users, ArrowRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface JoinRoomProps {
  onJoinRoom: (roomId: string, username: string) => void;
  existingRoomId?: string;
}

export default function JoinRoom({ onJoinRoom, existingRoomId }: JoinRoomProps) {
  const [username, setUsername] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const createNewRoom = async () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const roomId = uuidv4();
      
      // Create the room
      const { error: roomError } = await supabase
        .from('chat_rooms')
        .insert([{ id: roomId, name: 'New Chat Room' }]);

      if (roomError) throw roomError;

      onJoinRoom(roomId, username.trim());
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Failed to create room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const joinExistingRoom = async () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!existingRoomId) {
      setError('Invalid room link');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      // Check if room exists
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('id', existingRoomId)
        .single();

      if (roomError || !room) {
        setError('Room not found. Please check the link.');
        return;
      }

      onJoinRoom(existingRoomId, username.trim());
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingRoomId) {
      joinExistingRoom();
    } else {
      createNewRoom();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <MessageCircle className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {existingRoomId ? 'Join Chat Room' : 'Start Chatting'}
          </h1>
          <p className="text-gray-600">
            {existingRoomId 
              ? 'Enter your name to join the conversation'
              : 'Create a new chat room and invite others with a shareable link'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your display name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!username.trim() || isJoining}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isJoining ? (
              <span>Loading...</span>
            ) : (
              <>
                {existingRoomId ? <Users className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                <span>{existingRoomId ? 'Join Room' : 'Create New Room'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {!existingRoomId && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-center text-sm text-gray-500">
              <p>Once created, share the room link with others to chat together!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}