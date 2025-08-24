import React, { useState, useEffect, useRef } from 'react';
import {
    FiMessageSquare,
    FiUserPlus,
    FiUsers,
    FiChevronLeft,
    FiSearch,
    FiMoreVertical,
    FiTrash2,
    FiCheck,
    FiX,
    FiSend,
    FiArrowLeft
} from 'react-icons/fi';
import {
    outgoingRequest,
    incomingRequests,
    approveRequest,
    rejectRequest,
    listFriends,
    removeFriend
} from '../api/friends';
import { AnimatedBubbles } from '../components/AnimatedBg.jsx';

// Friend List Component
function FriendList({ friends, onSelectFriend, selectedFriend, onRemoveFriend, showChat, searchQuery, setSearchQuery }) {
    const filteredFriends = friends.filter(friend =>
        friend.publicKey.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className={`bg-[var(--color-surface)] h-full flex flex-col border-r border-[var(--color-border)] ${showChat ? 'hidden lg:block' : 'block'}`}>
            <div className="p-4 border-b border-[var(--color-border)] flex-shrink-0">
                <div className="relative w-full">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                    <input
                        type="text"
                        placeholder="Search by public key..."
                        className="pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg text-sm w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden pb-42">
                <div className="h-full overflow-y-auto scrollbar-hide">
                    <div className="divide-y divide-[var(--color-border)]">
                        {filteredFriends.map(friend => (
                            <div
                                key={friend.id}
                                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-[var(--color-main-bg)] transition-all duration-200 ${selectedFriend?.id === friend.id ? 'bg-[var(--color-main-bg)]' : ''}`}
                                onClick={() => onSelectFriend(friend)}
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--color-main)] flex items-center justify-center text-[var(--color-text-inverse)] font-semibold text-sm md:text-base">
                                        {friend.publicKey.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm md:text-base font-medium text-[var(--color-text)] font-mono">{friend.publicKey.substring(0, 12)}...</h3>
                                        <p className="text-xs md:text-sm text-[var(--color-text-light)] truncate max-w-[150px] md:max-w-xs">
                                            {friend.lastMessage || "Start a conversation..."}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveFriend(friend.id);
                                    }}
                                    className="p-2 text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-full transition-colors"
                                    aria-label="Remove friend"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {filteredFriends.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-[var(--color-text-light)]">No friends found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Chat Window Component
function ChatWindow({ selectedFriend, messages, onBack, showChat }) {
    const [newMessage, setNewMessage] = useState('');
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [newMessage]);

    // Add scroll to bottom effect
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Add key handler function
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            console.log(`Sending message to ${selectedFriend.publicKey}: ${newMessage}`);
            setNewMessage('');

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    return (
        <div className={`flex flex-col h-full bg-[var(--color-bg)] ${showChat ? 'block w-full' : 'hidden lg:block w-full'}`}>
            {selectedFriend ? (
                <>
                    <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center shadow-sm">
                        <button
                            onClick={onBack}
                            className="lg:hidden mr-3 p-2 text-[var(--color-text-light)] hover:bg-[var(--color-main-bg)] rounded-full transition-colors"
                            aria-label="Back to friends list"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--color-main)] flex items-center justify-center text-[var(--color-text-inverse)] font-semibold text-sm md:text-base">
                            {selectedFriend.publicKey.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm md:text-base font-medium text-[var(--color-text)] font-mono">{selectedFriend.publicKey.substring(0, 16)}...</h3>
                            {/* <p className="text-xs text-[var(--color-text-light)]">Online</p> */}
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}
                            >
                                <div
                                    className={`max-w-xs md:max-w-md rounded-lg p-3 text-sm md:text-base ${message.sender === 'me'
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
                    <h3 className="text-lg md:text-xl font-medium mb-2 text-[var(--color-text)]">Select a friend to start chatting</h3>
                    <p className="text-sm md:text-base">Choose a conversation from your friends list to begin messaging</p>
                </div>
            )}
        </div>
    );
}

// Friend Requests Component
function FriendRequests({ requests, onApprove, onReject, searchQuery, setSearchQuery }) {
    const filteredRequests = requests.filter(request =>
        request.publicKey.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[var(--color-surface)] h-full overflow-y-auto border-l border-[var(--color-border)]">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <div className="relative w-full">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                    <input
                        type="text"
                        placeholder="Search by public key..."
                        className="pl-10 pr-4 py-2 w-full border border-[var(--color-border)] rounded-lg text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="p-4">
                {filteredRequests.length > 0 ? (
                    <div className="space-y-4">
                        {filteredRequests.map(request => (
                            <div key={request.id} className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-text-inverse)] font-semibold text-sm">
                                            {request.publicKey.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-[var(--color-text)] font-mono">{request.publicKey.substring(0, 12)}...</h3>
                                            <p className="text-xs text-[var(--color-text-light)]">Want to be your friend</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onApprove(request.id)}
                                            className="bg-[var(--color-success)] hover:bg-[#15803d] text-[var(--color-text-inverse)] p-2 rounded-full transition-colors"
                                            aria-label="Approve request"
                                        >
                                            <FiCheck size={16} />
                                        </button>
                                        <button
                                            onClick={() => onReject(request.id)}
                                            className="bg-[var(--color-error)] hover:bg-[#b91c1c] text-[var(--color-text-inverse)] p-2 rounded-full transition-colors"
                                            aria-label="Reject request"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <FiUsers size={48} className="mb-4 text-[var(--color-text-light)]" />
                        <p className="text-sm text-[var(--color-text-light)]">No pending requests</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Add Friend Component
function AddFriend({ onSendRequest }) {
    const [publicKey, setPublicKey] = useState('');

    const handleSendRequest = () => {
        if (publicKey.trim()) {
            onSendRequest(publicKey);
            setPublicKey('');
        }
    };

    return (
        <div className="bg-[var(--color-surface)] p-4 border-b border-[var(--color-border)]">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--color-text)] mb-3 flex items-center">
                <FiUserPlus className="mr-2" /> Add Friend
            </h2>
            <div className="flex">
                <input
                    type="text"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    placeholder="Enter public key"
                    className="flex-1 border border-[var(--color-border)] rounded-l-lg px-4 py-2 text-sm md:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendRequest()}
                />
                <button
                    onClick={handleSendRequest}
                    className="bg-[var(--color-main)] hover:bg-[var(--color-main-hover)] text-[var(--color-text-inverse)] px-4 py-2 rounded-r-lg text-sm md:text-base transition-colors"
                >
                    Send Request
                </button>
            </div>
        </div>
    );
}

// Main Dashboard Component
export default function Dashboard() {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [activeView, setActiveView] = useState('chats'); // 'chats' or 'requests'
    const [showChat, setShowChat] = useState(false);
    const [chatSearchQuery, setChatSearchQuery] = useState('');
    const [requestSearchQuery, setRequestSearchQuery] = useState('');

    // Mock data for demonstration
    useEffect(() => {
        // In a real app, you would fetch this data from the API
        setFriends([
            { id: 1, publicKey: 'aserere', lastMessage: '' },
            { id: 2, publicKey: 'bngfdfd', lastMessage: '' },
            { id: 3, publicKey: 'cvbcvbc', lastMessage: '' },
            { id: 4, publicKey: 'dfgdfgd', lastMessage: '' },
        ]);

        setRequests([
            { id: 101, publicKey: 'ewrwerw' },
            { id: 102, publicKey: 'fghfghf' },
        ]);
    }, []);

    // Mock messages for demonstration
    const mockMessages = {
        1: [
            { id: 1, text: 'Hey there!', sender: 'friend' },
            { id: 2, text: 'Hi! How are you?', sender: 'me' },
            { id: 3, text: "I'm good, thanks for asking!", sender: 'friend' },
        ],
        2: [
            { id: 1, text: 'Meeting tomorrow at 10 AM', sender: 'friend' },
            { id: 2, text: "Got it, I'll be there", sender: 'me' },
        ],
        3: [
            { id: 1, text: 'Did you watch the game last night?', sender: 'friend' },
            { id: 2, text: 'Yes, it was amazing!', sender: 'me' },
        ],
        4: [
            { id: 1, text: 'Thanks for helping me with the project', sender: 'friend' },
            { id: 2, text: "No problem, that's what friends are for!", sender: 'me' },
        ],
    };

    const handleBackToFriends = () => {
        setShowChat(false);
        setSelectedFriend(null);
        if (window.history.state?.chatOpen) {
            window.history.back();
        }
    };

    const handleSelectFriend = (friend) => {
        setSelectedFriend(friend);
        setShowChat(true);
        // Add history state when opening chat
        window.history.pushState({ chatOpen: true }, '');
    };

    // Add browser back button handling
    useEffect(() => {
        const handleBrowserBack = (event) => {
            if (showChat) {
                handleBackToFriends();
                // Prevent default back navigation
                window.history.pushState(null, '', window.location.pathname);
            }
        };

        window.addEventListener('popstate', handleBrowserBack);

        if (showChat) {
            window.history.pushState({ chatOpen: true }, '');
        }

        return () => {
            window.removeEventListener('popstate', handleBrowserBack);
            if (showChat && window.history.state?.chatOpen) {
                window.history.back();
            }
        };
    }, [showChat]);

    const handleSendRequest = async (publicKey) => {
        try {
            // In a real app, you would call the API
            // await outgoingRequest(publicKey);
            console.log(`Friend request sent to: ${publicKey}`);
            alert(`Friend request sent to: ${publicKey}`);
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    };

    const handleApproveRequest = async (requestId) => {
        try {
            // In a real app, you would call the API
            // await approveRequest(publicKey);
            const approvedRequest = requests.find(req => req.id === requestId);
            setFriends([...friends, {
                id: Date.now(),
                publicKey: approvedRequest.publicKey,
                lastMessage: ""
            }]);
            setRequests(requests.filter(req => req.id !== requestId));
            console.log(`Request approved: ${requestId}`);
        } catch (error) {
            console.error('Failed to approve request:', error);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            // In a real app, you would call the API
            // await rejectRequest(publicKey);
            setRequests(requests.filter(req => req.id !== requestId));
            console.log(`Request rejected: ${requestId}`);
        } catch (error) {
            console.error('Failed to reject request:', error);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            // In a real app, you would call the API
            // await removeFriend(publicKey);
            setFriends(friends.filter(friend => friend.id !== friendId));
            if (selectedFriend?.id === friendId) {
                setSelectedFriend(null);
                setShowChat(false);
            }
            console.log(`Friend removed: ${friendId}`);
        } catch (error) {
            console.error('Failed to remove friend:', error);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden">
            <AnimatedBubbles />

            <div className="relative z-10 h-[100dvh] flex flex-col">
                <header className={`p-4 bg-[var(--color-surface)] border-b border-[var(--color-border)] ${showChat ? 'lg:block hidden' : 'block'}`}>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-main)]">Secure Chat</h1>
                    <p className="text-sm md:text-base text-[var(--color-text-light)]">End-to-end encrypted messaging</p>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left sidebar - Friend list and Add friend - Always visible on large screens */}
                    <div className={`bg-[var(--color-surface)] h-full overflow-hidden ${showChat ? 'hidden lg:block w-96' : 'block w-full lg:w-96'}`}>
                        <AddFriend onSendRequest={handleSendRequest} />

                        <div className="flex border-b border-[var(--color-border)]">
                            <button
                                className={`flex-1 py-3 text-sm md:text-base font-medium flex items-center justify-center ${activeView === 'chats' ? 'text-[var(--color-main)] border-b-2 border-[var(--color-main)]' : 'text-[var(--color-text-light)]'}`}
                                onClick={() => setActiveView('chats')}
                            >
                                <FiMessageSquare className="mr-2" /> Chats
                            </button>
                            <button
                                className={`flex-1 py-3 text-sm md:text-base font-medium flex items-center justify-center ${activeView === 'requests' ? 'text-[var(--color-main)] border-b-2 border-[var(--color-main)]' : 'text-[var(--color-text-light)]'}`}
                                onClick={() => setActiveView('requests')}
                            >
                                <FiUserPlus className="mr-2" /> Requests
                            </button>
                        </div>

                        <div className="h-full overflow-y-auto">
                            {activeView === 'chats' ? (
                                <FriendList
                                    friends={friends}
                                    onSelectFriend={handleSelectFriend}
                                    selectedFriend={selectedFriend}
                                    onRemoveFriend={handleRemoveFriend}
                                    showChat={showChat}
                                    searchQuery={chatSearchQuery}
                                    setSearchQuery={setChatSearchQuery}
                                />
                            ) : (
                                <FriendRequests
                                    requests={requests}
                                    onApprove={handleApproveRequest}
                                    onReject={handleRejectRequest}
                                    searchQuery={requestSearchQuery}
                                    setSearchQuery={setRequestSearchQuery}
                                />
                            )}
                        </div>
                    </div>

                    {/* Main chat area - Takes full width when active on mobile, right side on desktop */}
                    <div className={`${showChat ? 'flex flex-1' : 'hidden lg:flex flex-1'} bg-[var(--color-bg)]`}>
                        <ChatWindow
                            selectedFriend={selectedFriend}
                            messages={selectedFriend ? mockMessages[selectedFriend.id] || [] : []}
                            onBack={handleBackToFriends}
                            showChat={showChat}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}