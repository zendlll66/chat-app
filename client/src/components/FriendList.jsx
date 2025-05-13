import React from 'react'

/* eslint-disable react/prop-types */
const FriendList = ({ friends }) => {
    return (
        <div id="chat-friend-list" className="p-4">
            <h3 className="text-lg font-semibold mb-4">Online Users</h3>
            <div className="space-y-2">
                {friends.map((friend) => (
                    <div key={friend.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
                        <div className={`w-2 h-2 rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-gray-700">{friend.name}</span>
                    </div>
                ))}
                {friends.length === 0 && (
                    <p className="text-gray-500 text-sm">No users online</p>
                )}
            </div>
        </div>
    )
}

export default FriendList

