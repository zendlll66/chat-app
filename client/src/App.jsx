import React from 'react'
import ChatFooter from './components/ChatFooter'
import { socket } from './lib/socket'
import { useEffect } from 'react'
import ChatBox from './components/Chatbox'
import { useState } from 'react'
import { useRef } from 'react'
import FriendList from './components/FriendList'

const App = () => {
  const [messages, setMessages] = useState([])
  const lastMessageRef = useRef(null)
  const [friends, setFriends] = useState([])
  const [username, setUsername] = useState('user' + Date.now())

  const handleNewMessage = (data) => {
    console.log('received message', data);
    setMessages((messages) => [...messages, data])
  }

  const handleRoomConnection = (data) => {
    console.log('received room connection', data);
    setFriends(data.users)
  }

  useEffect(() => {
    // เมื่อ component mount ให้ join room
    socket.emit('user:join', username);

    // Subscribe to events
    socket.on('chat:message', handleNewMessage)
    socket.on('chat:room', handleRoomConnection)
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('user:join', username);
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Cleanup function
    return () => {
      socket.off('chat:message', handleNewMessage)
      socket.off('chat:room', handleRoomConnection)
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [username]) // เพิ่ม username เป็น dependency

  // Separate useEffect for scrolling
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  return (
    <div className='flex flex-col gap-4'>
      <h1>Chat app</h1>
      <div className='border-2 border-gray-300 rounded-md p-4'>
        <FriendList friends={friends} />
      </div>
      <div className='border-2 border-gray-300 rounded-md p-4'>
        <ChatBox messages={messages} lastMessageRef={lastMessageRef} />
      </div>
      <div className='border-2 border-gray-300 rounded-md p-4'>
        <ChatFooter username={username} setUsername={setUsername} />
      </div>
    </div>
  )
}

export default App