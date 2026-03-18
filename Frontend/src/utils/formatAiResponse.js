export function extractContentFromResponse(messageObj) {
  const mainText = messageObj.text || ''
  const hasFiles = Object.keys(messageObj.fileTree || {}).length > 0

  if (hasFiles) {
    return {
      type: 'files',
      content: messageObj.fileTree,
      ...(mainText && { mainText }),
    }
  }

  return {
    type: 'text',
    content: mainText || JSON.stringify(messageObj),
  }
}

