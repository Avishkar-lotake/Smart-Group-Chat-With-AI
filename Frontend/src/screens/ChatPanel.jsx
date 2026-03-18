import React, { useRef, useEffect } from 'react'

const ChatPanel = ({
    user,
    messages,
    message,
    setMessage,
    onSend,
}) => {
    const messageBox = useRef(null)

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight
        }
    }, [messages])

    return (
        <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
            <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">
                <button className="flex gap-2">
                    <i className="ri-add-fill mr-1"></i>
                    <p>Add collaborator</p>
                </button>

                <button className="p-2">
                    <i className="ri-group-fill"></i>
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
                        <i className="ri-send-plane-fill"></i>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ChatPanel

