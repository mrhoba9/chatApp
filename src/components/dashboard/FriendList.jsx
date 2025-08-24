import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { FiTrash2 } from 'react-icons/fi';

function FriendList({ friends, onSelectFriend, selectedFriend, onRemoveFriend, showChat }) {
    const [searchQuery, setSearchQuery] = useState('');
    
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
                                <div className='flex gap-2'>
                                    <button title='add alice' className='p-2 text-[var(--color-secondary)] hover:bg-[var(--color-secondary-bg)] rounded-full transition-colors'>
                                        <MdOutlineDriveFileRenameOutline />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveFriend(friend.id);
                                        }}
                                        className="p-2 text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-full transition-colors"
                                        title='remove friend'
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
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

export default FriendList;