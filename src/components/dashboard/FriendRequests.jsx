import { useState } from 'react';
import { FiSearch, FiCheck, FiX, FiUsers } from 'react-icons/fi';

function FriendRequests({ requests, onApprove, onReject }) {
    const [searchQuery, setSearchQuery] = useState('');
    
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
                                            title="Approve request"
                                        >
                                            <FiCheck size={16} />
                                        </button>
                                        <button
                                            onClick={() => onReject(request.id)}
                                            className="bg-[var(--color-error)] hover:bg-[#b91c1c] text-[var(--color-text-inverse)] p-2 rounded-full transition-colors"
                                            title="Reject request"
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

export default FriendRequests;