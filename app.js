// app.js
// Handles the chat interface interactions

// Initialize the agent with mock data
const agent = new CreatorAssistantAgent(mockCreatorData);

// Get DOM elements
const messagesContainer = document.getElementById('messagesContainer');
const userInput = document.getElementById('userInput');
const welcomeScreen = document.getElementById('welcomeScreen');
const welcomeInput = document.getElementById('welcomeInput');
const inputContainer = document.querySelector('.input-container');

// Initialize chat on page load
window.addEventListener('load', () => {
    // Check if there's existing conversation history
    if (conversationHistory.length === 0) {
        showEmptyState();
    } else {
        hideEmptyState();
        // Load existing messages from history
        loadConversationHistory();
    }
});

/**
 * Show empty state (welcome screen)
 */
function showEmptyState() {
    if (welcomeScreen) {
        welcomeScreen.style.display = 'flex';
    }
    if (inputContainer) {
        inputContainer.classList.add('hidden');
    }
}

/**
 * Hide empty state and show normal chat interface
 */
function hideEmptyState() {
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
    if (inputContainer) {
        inputContainer.classList.remove('hidden');
    }
}

/**
 * Handle welcome input key press
 */
function handleWelcomeKeyPress(event) {
    if (event.key === 'Enter') {
        sendWelcomeMessage();
    }
}

/**
 * Send message from welcome input
 */
function sendWelcomeMessage() {
    const message = welcomeInput.value.trim();
    if (message) {
        hideEmptyState();
        sendMessage(message);
        welcomeInput.value = '';
    }
}

/**
 * Load conversation history from localStorage
 */
function loadConversationHistory() {
    conversationHistory.forEach(entry => {
        addMessage(entry.role, entry.content);
    });
}

/**
 * Go back to welcome screen (clear chat and reset)
 */
function goBackToWelcome() {
    // Clear all messages from the container
    const messages = messagesContainer.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
    
    // Clear conversation history
    conversationHistory.length = 0;
    localStorage.removeItem('chatHistory');
    
    // Show empty state
    showEmptyState();
    
    // Clear inputs
    if (userInput) userInput.value = '';
    if (welcomeInput) welcomeInput.value = '';
}

// Typewriter state management
let isTyping = false;
let typingTimeouts = [];
let stopTypingRequested = false;

/**
 * Clear all typing timeouts
 */
function clearTypingTimeouts() {
    typingTimeouts.forEach(timeout => clearTimeout(timeout));
    typingTimeouts = [];
}

/**
 * Stop the current typing animation
 */
function stopTyping() {
    stopTypingRequested = true;
    clearTypingTimeouts();
    isTyping = false;
    enableInputs();
}

/**
 * Toggle send button to stop button
 */
function showStopButton() {
    const sendButton = document.getElementById('sendButton');
    const sendIcon = document.getElementById('sendIcon');
    const stopIcon = document.getElementById('stopIcon');
    
    if (sendButton && sendIcon && stopIcon) {
        sendButton.classList.add('stop-mode');
        sendIcon.style.display = 'none';
        stopIcon.style.display = 'block';
    }
}

/**
 * Toggle stop button back to send button
 */
function showSendButton() {
    const sendButton = document.getElementById('sendButton');
    const sendIcon = document.getElementById('sendIcon');
    const stopIcon = document.getElementById('stopIcon');
    
    if (sendButton && sendIcon && stopIcon) {
        sendButton.classList.remove('stop-mode');
        sendIcon.style.display = 'block';
        stopIcon.style.display = 'none';
    }
}

/**
 * Disable inputs during typing
 */
function disableInputs() {
    if (userInput) {
        userInput.disabled = true;
        userInput.placeholder = "AI is responding...";
    }
    if (welcomeInput) {
        welcomeInput.disabled = true;
        welcomeInput.placeholder = "AI is responding...";
    }
    showStopButton();
}

/**
 * Enable inputs after typing
 */
function enableInputs() {
    if (userInput) {
        userInput.disabled = false;
        userInput.placeholder = "How can I help you today?";
    }
    if (welcomeInput) {
        welcomeInput.disabled = false;
        welcomeInput.placeholder = "How can I help you today?";
    }
    showSendButton();
}

/**
 * Add disclaimer and autocompletes after typing is complete
 */
function addDisclaimerAndAutocompletes(messageDiv) {
    const disclaimerDiv = document.createElement('div');
    disclaimerDiv.className = 'message-disclaimer';
    disclaimerDiv.innerHTML = 'LTK AI can make mistakes.<br>Please double check responses.';
    messageDiv.appendChild(disclaimerDiv);
    
    // Add autocompletes
    const autocompletesDiv = document.createElement('div');
    autocompletesDiv.className = 'message-autocompletes';
    
    const autocompleteOptions = [
        'What are my top products',
        'Give me an overview of my shop',
        'Tell me about my followers',
        'Tell me about my earnings',
        'Give me recommendations'
    ];
    
    autocompleteOptions.forEach(option => {
        const chip = document.createElement('button');
        chip.className = 'autocomplete-chip';
        chip.onclick = () => sendQuickAction(option);
        
        const chipText = document.createElement('span');
        chipText.className = 'autocomplete-chip-text';
        chipText.textContent = option;
        
        chip.appendChild(chipText);
        autocompletesDiv.appendChild(chip);
    });
    
    messageDiv.appendChild(autocompletesDiv);
}

/**
 * Typewriter effect for assistant messages
 * Adaptive speed: character-by-character for short, line-by-line for long
 */
function typewriterEffect(messageContent, htmlContent, onComplete) {
    stopTypingRequested = false;
    const contentLength = htmlContent.replace(/<[^>]*>/g, '').length; // Count without HTML tags
    
    // Adaptive speed based on content length
    const useCharByChar = contentLength < 300; // Short responses: char-by-char
    
    if (useCharByChar) {
        // Character-by-character typing (15ms per char)
        typeCharByChar(messageContent, htmlContent, onComplete);
    } else {
        // Line-by-line typing for longer content (100ms per line)
        typeLineByLine(messageContent, htmlContent, onComplete);
    }
}

/**
 * Type character by character
 */
function typeCharByChar(messageContent, htmlContent, onComplete) {
    let displayText = '';
    let htmlIndex = 0;
    const typingSpeed = 15; // milliseconds per character
    
    messageContent.classList.add('typing-cursor');
    
    function typeNextChar() {
        if (stopTypingRequested) {
            messageContent.innerHTML = htmlContent;
            messageContent.classList.remove('typing-cursor');
            onComplete();
            return;
        }
        
        if (htmlIndex < htmlContent.length) {
            // Handle HTML tags - don't type them character by character
            if (htmlContent[htmlIndex] === '<') {
                const tagEnd = htmlContent.indexOf('>', htmlIndex);
                if (tagEnd !== -1) {
                    displayText += htmlContent.substring(htmlIndex, tagEnd + 1);
                    htmlIndex = tagEnd + 1;
                } else {
                    displayText += htmlContent[htmlIndex];
                    htmlIndex++;
                }
            } else {
                displayText += htmlContent[htmlIndex];
                htmlIndex++;
            }
            
            messageContent.innerHTML = displayText;
            
            // Smooth scroll using requestAnimationFrame
            requestAnimationFrame(() => scrollToUserQuestion());
            
            const timeout = setTimeout(typeNextChar, typingSpeed);
            typingTimeouts.push(timeout);
        } else {
            // Typing complete
            messageContent.classList.remove('typing-cursor');
            onComplete();
        }
    }
    
    typeNextChar();
}

/**
 * Type line by line
 */
function typeLineByLine(messageContent, htmlContent, onComplete) {
    const lines = htmlContent.split('<br>');
    let lineIndex = 0;
    const typingSpeed = 100; // milliseconds per line
    
    messageContent.classList.add('typing-cursor');
    
    function typeNextLine() {
        if (stopTypingRequested) {
            messageContent.innerHTML = htmlContent;
            messageContent.classList.remove('typing-cursor');
            onComplete();
            return;
        }
        
        if (lineIndex < lines.length) {
            const displayLines = lines.slice(0, lineIndex + 1).join('<br>');
            messageContent.innerHTML = displayLines;
            lineIndex++;
            
            // Smooth scroll using requestAnimationFrame
            requestAnimationFrame(() => scrollToUserQuestion());
            
            const timeout = setTimeout(typeNextLine, typingSpeed);
            typingTimeouts.push(timeout);
        } else {
            // Typing complete
            messageContent.classList.remove('typing-cursor');
            onComplete();
        }
    }
    
    typeNextLine();
}

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
    
    // Convert **text** to <strong>text</strong> for bold formatting
    const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert line breaks to <br> tags
    const htmlContent = formattedContent.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // User messages: show immediately
    if (role === 'user') {
        messageContent.innerHTML = htmlContent;
        scrollToBottom();
        return;
    }
    
    // Assistant messages: use typewriter effect
    if (role === 'assistant') {
        isTyping = true;
        disableInputs();
        
        typewriterEffect(messageContent, htmlContent, () => {
            // Typing complete
            isTyping = false;
            enableInputs();
            
            // Add disclaimer and autocompletes
            addDisclaimerAndAutocompletes(messageDiv);
            
            // Final scroll
            requestAnimationFrame(() => scrollToUserQuestion());
        });
    }
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
 * Scroll to show the user's question at the top (below the header)
 */
function scrollToUserQuestion() {
    // Get all user messages
    const userMessages = messagesContainer.querySelectorAll('.message.user');
    
    // Get the last user message (most recent question)
    if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1];
        
        // Calculate scroll position to show question at top of visible area
        // We need to account for the padding at the top of the messages container
        const messageOffsetInContainer = lastUserMessage.offsetTop - messagesContainer.offsetTop;
        
        // Scroll so the question appears at the very top of the scrollable area
        // Adding a small padding (20px) for visual comfort
        messagesContainer.scrollTop = messageOffsetInContainer - 20;
    }
}

/**
 * Handle send button click (send or stop based on state)
 */
function handleSendButtonClick() {
    if (isTyping) {
        stopTyping();
    } else {
        sendMessage();
    }
}

/**
 * Send a message from user input
 */
function sendMessage(messageText = null) {
    const message = messageText || userInput.value.trim();
    
    // Don't send empty messages
    if (!message) return;
    
    // Hide empty state if it's showing
    if (welcomeScreen && welcomeScreen.style.display !== 'none') {
        hideEmptyState();
    }
    
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