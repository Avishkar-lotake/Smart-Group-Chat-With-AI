import React from 'react'
import Markdown from 'markdown-to-jsx'

function FileTreeViewer({ files }) {
    return (
        <div className="space-y-3">
            {Object.entries(files).map(([filename, fileObj]) => (
                <div
                    key={filename}
                    className="border border-slate-300 rounded overflow-hidden"
                >
                    <div className="bg-slate-800 text-white p-2 font-mono text-xs">
                        {filename}
                    </div>
                    <pre className="p-4 bg-slate-950 text-green-400 overflow-auto text-xs max-h-64">
                        <code>
                            {fileObj.file?.contents ||
                                JSON.stringify(fileObj, null, 2)}
                        </code>
                    </pre>
                </div>
            ))}
        </div>
    )
}

function RenderRightPanelContent({ content }) {
    if (!content) return null

    const { type, content: data, mainText } = content

    if (type === 'files') {
        return (
            <div className="space-y-4">
                {mainText && (
                    <div className="prose max-w-none">
                        <Markdown>{mainText}</Markdown>
                    </div>
                )}
                <FileTreeViewer files={data} />
            </div>
        )
    }

    // Default text rendering (text type)
    return (
        <div className="prose max-w-none">
            <Markdown>{data}</Markdown>
        </div>
    )
}

const AiPreviewPanel = ({ rightPanelContent }) => {

    return (
        <section className="right bg-slate-50 flex-grow h-full flex flex-col">
            {/* Header */}
            <div className="p-4 bg-slate-200 border-b border-slate-300 flex items-center">
                <h3 className="font-semibold text-slate-700">
                    {rightPanelContent ? 'AI Response' : 'Files & Code'}
                </h3>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-auto p-4">
                {rightPanelContent ? (
                    <RenderRightPanelContent content={rightPanelContent} />
                ) : (
                    <p className="text-slate-500 text-center py-4">
                        No files or AI responses
                    </p>
                )}
            </div>
        </section>
    )
}

export default AiPreviewPanel

