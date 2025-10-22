// app.js
// Handles the chat interface interactions

// Initialize the agent with mock data
const agent = new CreatorAssistantAgent(mockCreatorData);

// Get DOM elements
const messagesContainer = document.getElementById('messagesContainer');
const userInput = document.getElementById('userInput');

// Initialize chat on page load
window.addEventListener('load', () => {
    // Send welcome message
    const welcomeMessage = agent.processQuery('help');
    addMessage('assistant', welcomeMessage);
});

/**
 * Add a message to the chat interface
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - The message content
 */
function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    // Add sender name for user messages
    if (role === 'user') {
        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';
        senderDiv.textContent = 'Dave';
        messageDiv.appendChild(senderDiv);
    }
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    
    // Add disclaimer for assistant messages
    if (role === 'assistant') {
        const disclaimerDiv = document.createElement('div');
        disclaimerDiv.className = 'message-disclaimer';
        disclaimerDiv.innerHTML = 'LTK AI can make mistakes.<br>Please double check responses.';
        messageDiv.appendChild(disclaimerDiv);
    }
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    scrollToBottom();
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typingIndicator';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator active';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(indicator);
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * Scroll messages container to bottom
 */
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Send a message from user input
 */
function sendMessage() {
    const message = userInput.value.trim();
    
    // Don't send empty messages
    if (!message) return;
    
    // Add user message to chat
    addMessage('user', message);
    
    // Clear input
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate processing delay (makes it feel more natural)
    setTimeout(() => {
        removeTypingIndicator();
        
        // Get response from agent
        const response = agent.processQuery(message);
        
        // Add assistant response
        addMessage('assistant', response);
    }, 800);
}

/**
 * Send a quick action message
 * @param {string} message - The pre-defined message
 */
function sendQuickAction(message) {
    userInput.value = message;
    sendMessage();
}

/**
 * Handle Enter key press in input
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

/**
 * Optional: Add conversation history tracking
 */
const conversationHistory = [];

function addToHistory(role, content) {
    conversationHistory.push({
        role: role,
        content: content,
        timestamp: new Date().toISOString()
    });
    
    // Optional: Save to localStorage for persistence
    localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
}

/**
 * Optional: Load conversation history
 */
function loadHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        const history = JSON.parse(savedHistory);
        history.forEach(msg => {
            addMessage(msg.role, msg.content);
        });
    }
}

/**
 * Optional: Clear conversation
 */
function clearConversation() {
    messagesContainer.innerHTML = '';
    conversationHistory.length = 0;
    localStorage.removeItem('chatHistory');
    
    // Re-send welcome message
    const welcomeMessage = agent.processQuery('help');
    addMessage('assistant', welcomeMessage);
}

// Optional: Expose clear function to window for debugging
window.clearConversation = clearConversation;