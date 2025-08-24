/*
  # Create chat application schema

  1. New Tables
    - `chat_rooms`
      - `id` (uuid, primary key) - unique room identifier
      - `name` (text) - optional room name
      - `created_at` (timestamp)
    - `messages`
      - `id` (uuid, primary key)
      - `room_id` (uuid, foreign key to chat_rooms)
      - `username` (text) - sender's display name
      - `content` (text) - message content
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow anyone to read and insert (since access is link-based)
*/

CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text DEFAULT 'Chat Room',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  username text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read and insert chat rooms (access controlled by knowing the link)
CREATE POLICY "Anyone can read chat rooms"
  ON chat_rooms
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create chat rooms"
  ON chat_rooms
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read and insert messages (access controlled by knowing the room)
CREATE POLICY "Anyone can read messages"
  ON messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can send messages"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_room_id_created_at 
  ON messages(room_id, created_at DESC);