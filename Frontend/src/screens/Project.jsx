import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/User.context.jsx'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, removeMessageListener, sendMessage } from '../config/socket'
import { extractContentFromResponse } from '../utils/formatAiResponse'
import ChatPanel from './ChatPanel'
import AiPreviewPanel from './AiPreviewPanel'

const Project = () => {

    const location = useLocation()
    const { user } = useContext(UserContext)

    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [rightPanelContent, setRightPanelContent] = useState(null)

    useEffect(() => {
        if (!project?._id) return

        axios.get(`/projects/get-project/${project._id}`)
            .then(res => {
                setProject(res.data.project)
                setRightPanelContent(null)
            })
    }, [project._id])


    useEffect(() => {
        if (!project?._id) return

        initializeSocket(project._id)

        const handleProjectMessage = (data) => {
            if (data.sender._id === 'ai') {
                const messageObj = data.message
                const extractedContent = extractContentFromResponse(messageObj)
                setRightPanelContent(extractedContent)
            } else {
                setMessages(prev => [...prev, data])
            }
        }

        receiveMessage('project-message', handleProjectMessage)

        return () => {
            removeMessageListener('project-message', handleProjectMessage)
        }
    }, [project._id])



    const send = () => {
        if (!message.trim()) return

        sendMessage('project-message', { message, sender: user })
        setMessages(prev => [...prev, { sender: user, message }])
        setMessage('')
    }



    return (
        <main className='h-screen w-screen flex'>
            <ChatPanel
                user={user}
                messages={messages}
                message={message}
                setMessage={setMessage}
                onSend={send}
            />

            <AiPreviewPanel
                rightPanelContent={rightPanelContent}
            />
        </main>
    )
}

export default Project
