import React, { useRef, useEffect, useState } from 'react'
import axios from '../config/axios'

const ChatPanel = ({
    user,
    messages,
    message,
    setMessage,
    onSend,
    project,
}) => {
    const messageBox = useRef(null)
    const [showAddCollaborator, setShowAddCollaborator] = useState(false)
    const [showCollaborators, setShowCollaborators] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [projectUsers, setProjectUsers] = useState([])

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight
        }
    }, [messages])

    // Fetch all users when add collaborator modal opens
    useEffect(() => {
        if (showAddCollaborator) {
            fetchAllUsers()
        }
    }, [showAddCollaborator])

    // Set project users when project changes
    useEffect(() => {
        if (project?.users) {
            setProjectUsers(project.users)
        }
    }, [project])

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('/users/all')
            setAllUsers(response.data.users || [])
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const handleAddCollaborator = async () => {
        if (selectedUsers.length === 0) return

        try {
            const response = await axios.put('/projects/add-user', {
                projectId: project._id,
                users: selectedUsers
            })
            
            // Update project users
            setProjectUsers(response.data.project.users)
            setSelectedUsers([])
            setShowAddCollaborator(false)
        } catch (error) {
            console.error('Error adding collaborators:', error)
        }
    }

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }

    return (
        <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
            <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">
                <button 
                    onClick={() => setShowAddCollaborator(true)}
                    className="flex gap-2 hover:bg-slate-200 p-1 rounded"
                >
                    <span className="mr-1">+</span>
                    <p>Add collaborator</p>
                </button>

                <button 
                    onClick={() => setShowCollaborators(!showCollaborators)}
                    className="p-2 hover:bg-slate-200 rounded"
                >
                    <span>👥</span>
                </button>
            </header>

            <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
                <div
                    ref={messageBox}
                    className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto"
                >
                    {messages.map((msg, i) => {
                        const isCurrentUser = msg.sender._id === user?._id

                        return (
                            <div
                                key={msg._id || i}
                                className={`${isCurrentUser ? 'ml-auto' : ''} message flex flex-col p-2 bg-slate-50 w-fit rounded-md max-w-80`}
                            >
                                <small className="opacity-65 text-xs">{msg.sender.email}</small>

                                <div className="text-sm">
                                    <p>
                                        {typeof msg.message === 'string'
                                            ? msg.message
                                            : msg.message?.text ||
                                            JSON.stringify(msg.message)}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="inputField w-full flex absolute bottom-0">
                    <input
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="p-2 px-4 flex-grow"
                        placeholder="Enter message"
                    />
                    <button
                        onClick={onSend}
                        className="px-5 bg-slate-950 text-white"
                    >
                        <span>📤</span>
                    </button>
                </div>
            </div>

            {/* Add Collaborator Modal */}
            {showAddCollaborator && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Add Collaborators</h3>
                        
                        <div className="max-h-60 overflow-y-auto">
                            {allUsers.map((user) => (
                                <div key={user._id} className="flex items-center p-2 hover:bg-gray-100">
                                    <input
                                        type="checkbox"
                                        id={user._id}
                                        checked={selectedUsers.includes(user._id)}
                                        onChange={() => toggleUserSelection(user._id)}
                                        className="mr-3"
                                    />
                                    <label htmlFor={user._id} className="flex-1 cursor-pointer">
                                        <div>
                                            <p className="font-medium">{user.email}</p>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setShowAddCollaborator(false)
                                    setSelectedUsers([])
                                }}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCollaborator}
                                disabled={selectedUsers.length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                Add ({selectedUsers.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Show Collaborators Modal */}
            {showCollaborators && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h3 className="text-lg font-semibold mb-4">Project Collaborators</h3>
                        
                        <div className="max-h-60 overflow-y-auto">
                            {projectUsers.length > 0 ? (
                                projectUsers.map((user) => (
                                    <div key={user._id} className="p-2 hover:bg-gray-100">
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No collaborators yet</p>
                            )}
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowCollaborators(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ChatPanel

