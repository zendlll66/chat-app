import React from 'react'
import { useState } from 'react'
import { socket } from '../lib/socket';

const ChatFooter = ({ username, setUsername }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message) return;

        const payload = {
            username: username,
            message: message,
            time: new Date().toLocaleTimeString()
        }

        socket.emit('chat:message', payload);
        setMessage('');
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            setUsername(value);
        } else if (name === 'message') {
            setMessage(value);
        }
    }

    return (
        <div className='chat-footer'>
            <form className='chat-form' onSubmit={handleSubmit}>
                <input
                    type="text"
                    name='name'
                    value={username}
                    onChange={handleChange}
                    placeholder="Your name"
                />
                <input
                    type="text"
                    name='message'
                    value={message}
                    onChange={handleChange}
                    placeholder="Type a message..."
                />
                <button type='submit'>Send</button>
            </form>
        </div>
    )
}

export default ChatFooter