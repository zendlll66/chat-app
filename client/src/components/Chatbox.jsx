import React from 'react'

const ChatBox = ({ messages, lastMessageRef }) => {
    return (
        <>
            <div className='chat-box ' ref={lastMessageRef}>
                {messages.map((message, index) => (
                    <div key={index} className='chat-message flex flex-col'>
                        <span className='chat-message-username text-blue-500 mr-20'>{message.username}</span>
                        <span className='chat-message-message'>{message.message}</span>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ChatBox