import { useState, useEffect, useRef } from 'react';
import { FiArrowLeft, FiSend, FiMessageSquare } from 'react-icons/fi';

export default function ChatWindow({ selectedFriend, onBack, showChat }) {
    const mockMessages = {
        1: [
            { id: 1, text: 'Hey there!', sender: 'asasas' },
            { id: 2, text: 'Hi! How are you?', sender: 'qwqwqwqw' },
            { id: 3, text: "I'm good, thanks for asking!", sender: 'asasas' },
        ],
        2: [
            { id: 1, text: 'Meeting tomorrow at 10 AM', sender: 'asasas' },
            { id: 2, text: "Got it, I'll be there", sender: 'qwqwqwqw' },
        ],
        3: [
            { id: 1, text: 'Did you watch the game last night?', sender: 'asasas' },
            { id: 2, text: 'Yes, it was amazing!', sender: 'qwqwqwqw' },
        ],
        4: [
            { id: 1, text: 'Thanks for helping me with the project', sender: 'asasas' },
            { id: 2, text: "No problem, that's what friends are for!", sender: 'qwqwqwqw' },
        ],
    };

    const [newMessage, setNewMessage] = useState('');
    const [myPublicKey] = useState("qwqwqwqw");
    const [messages, setMessages] = useState([]);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Load messages whenever selectedFriend changes
    useEffect(() => {
        if (selectedFriend) {
            setMessages(mockMessages[selectedFriend.id] || []);
        }
    }, [selectedFriend]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [newMessage]);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedFriend) {
            const newMsg = {
                id: Date.now(),
                text: newMessage,
                sender: myPublicKey,
            };
            setMessages((prev) => [...prev, newMsg]); // add to chat
            setNewMessage('');
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
        }
    };

    return (
        <div className={`flex flex-col h-full bg-[var(--color-bg)] ${showChat ? 'block w-full' : 'hidden lg:block w-full'}`}>
            {selectedFriend ? (
                <>
                    {/* Header */}
                    <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center shadow-sm">
                        <button
                            onClick={onBack}
                            className="lg:hidden mr-3 p-2 text-[var(--color-text-light)] hover:bg-[var(--color-main-bg)] rounded-full transition-colors"
                            title="Back to friends list"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--color-main)] flex items-center justify-center text-[var(--color-text-inverse)] font-semibold text-sm md:text-base">
                            {selectedFriend.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm md:text-base font-medium text-[var(--color-text)] font-mono">
                                {selectedFriend.substring(0, 16)}...
                            </h3>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.sender === myPublicKey ? 'justify-end' : 'justify-start'} mb-4`}
                            >
                                <div
                                    className={`max-w-xs md:max-w-md rounded-lg p-3 text-sm md:text-base ${
                                        message.sender === myPublicKey
                                            ? 'bg-[var(--color-main)] text-[var(--color-text-inverse)] rounded-br-none'
                                            : 'bg-[var(--color-surface)] text-[var(--color-text)] rounded-bl-none border border-[var(--color-border)]'
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                        <div className="flex items-end">
                            <div className="flex-1 relative">
                                <textarea
                                    ref={textareaRef}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={window.innerWidth >= 768 ? handleKeyDown : undefined}
                                    placeholder="Type your message..."
                                    className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 pr-12 text-sm resize-none transition-all duration-200 min-h-[44px] max-h-[120px] overflow-hidden"
                                    rows={1}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="absolute right-[0.9px] bottom-[6px] bg-[var(--color-main)] hover:bg-[var(--color-main-hover)] text-[var(--color-text-inverse)] p-2 rounded-full transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-main)] shadow-md flex items-center justify-center w-8 h-8"
                                    title="send message"
                                >
                                    <FiSend className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-light)] p-4 text-center">
                    <FiMessageSquare size={48} className="mb-4 text-[var(--color-main-light)]" />
                    <h3 className="text-lg md:text-xl font-medium mb-2 text-[var(--color-text)]">
                        Select a friend to start chatting
                    </h3>
                    <p className="text-sm md:text-base">
                        Choose a conversation from your friends list to begin messaging
                    </p>
                </div>
            )}
        </div>
    );
}