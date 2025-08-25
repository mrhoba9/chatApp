import { useState, useEffect } from 'react';
import { FiMessageSquare, FiUserPlus } from 'react-icons/fi';
import { AnimatedBubbles } from '../components/AnimatedBg.jsx';
import FriendList from '../components/dashboard/FriendList';
import ChatWindow from '../components/dashboard/ChatWindow';
import FriendRequests from '../components/dashboard/FriendRequests';
import AddFriend from '../components/dashboard/AddFriend';

export default function Dashboard() {
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [activeView, setActiveView] = useState('chats');
    const [showChat, setShowChat] = useState(false);

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
        window.history.pushState({ chatOpen: true }, '');
    };

    useEffect(() => {
        const handleBrowserBack = (event) => {
            if (showChat) {
                handleBackToFriends();
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


    

    return (
        <div className="min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden">
            <AnimatedBubbles />

            <div className="relative z-10 h-[100dvh] flex flex-col">
                <header className={`p-4 bg-[var(--color-surface)] border-b border-[var(--color-border)] ${showChat ? 'lg:block hidden' : 'block'}`}>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-main)]">Secure Chat</h1>
                    <p className="text-sm md:text-base text-[var(--color-text-light)]">End-to-end encrypted messaging</p>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    <div className={`bg-[var(--color-surface)] h-full overflow-hidden ${showChat ? 'hidden lg:block w-96' : 'block w-full lg:w-96'}`}>
                        <AddFriend />

                        <div className="flex border-b border-[var(--color-border)]">
                            <button className={`flex-1 py-3 text-sm md:text-base font-medium flex items-center justify-center ${activeView === 'chats' ? 'text-[var(--color-main)] border-b-2 border-[var(--color-main)]' : 'text-[var(--color-text-light)]'}`} onClick={() => setActiveView('chats')}>
                                <FiMessageSquare className="mr-2" /> Chats
                            </button>
                            <button className={`flex-1 py-3 text-sm md:text-base font-medium flex items-center justify-center ${activeView === 'requests' ? 'text-[var(--color-main)] border-b-2 border-[var(--color-main)]' : 'text-[var(--color-text-light)]'}`} onClick={() => setActiveView('requests')}>
                                <FiUserPlus className="mr-2" /> Requests
                            </button>
                        </div>

                        <div className="h-full overflow-y-auto">
                            {activeView === 'chats' ? (
                                <FriendList
                                    onSelectFriend={handleSelectFriend}
                                    selectedFriend={selectedFriend}
                                    setSelectedFriend={setSelectedFriend}
                                    showChat={showChat}
                                    setShowChat={setShowChat}
                                />
                            ) : (
                                <FriendRequests />
                            )}
                        </div>
                    </div>

                    <div className={`${showChat ? 'flex flex-1' : 'hidden lg:flex flex-1'} bg-[var(--color-bg)]`}>
                        <ChatWindow
                            selectedFriend={selectedFriend}
                            onBack={handleBackToFriends}
                            showChat={showChat}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}