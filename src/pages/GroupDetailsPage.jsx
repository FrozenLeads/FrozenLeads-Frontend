import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Modal from '../components/common/Modal'; // Assuming you have a reusable Modal

const GroupDetailsPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [sharedLeads, setSharedLeads] = useState([]);
    const [availableLeads, setAvailableLeads] = useState([]); // Changed from myLeads for clarity
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for forms
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [leadToShare, setLeadToShare] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for the current user to check ownership
    const [currentUser, setCurrentUser] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [meRes, groupRes, sharedLeadsRes, allLeadsRes] = await Promise.all([
                api.get('/me'),
                api.get(`/collab/${groupId}`),
                api.get(`/collab/${groupId}/leads`),
                api.get('/lead/data/all')
            ]);

            setCurrentUser(meRes.data);
            setGroup(groupRes.data.data);
            setSharedLeads(sharedLeadsRes.data.data);

            // --- THIS IS THE FIX FOR THE DROPDOWN ---
            const sharedLeadIds = new Set(sharedLeadsRes.data.data.map(sl => sl.lead._id));
            const available = allLeadsRes.data.data.filter(lead => !sharedLeadIds.has(lead._id));
            setAvailableLeads(available);
            // --- END OF FIX ---

        } catch (error) {
            console.error("Failed to fetch group details", error);
            setError(error.response?.data?.message || 'Could not load group details.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { fetchData(); }, [groupId]);

    const handleAddCollaborator = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post(`/collab/${groupId}/add-collaborator`, { email: collaboratorEmail });
            setCollaboratorEmail('');
            fetchData();
        } catch (error) {
            alert('Failed to add collaborator: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveCollaborator = async (collaboratorId) => {
        if (window.confirm("Are you sure you want to remove this collaborator?")) {
            try {
                await api.post(`/collab/${groupId}/remove-collaborator`, { collaboratorId });
                fetchData();
            } catch (error) {
                alert('Failed to remove collaborator: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleDeleteGroup = async () => {
        if (window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
            try {
                await api.delete(`/collab/${groupId}`);
                navigate('/groups');
            } catch (error) {
                alert('Failed to delete group: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleShareLead = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post(`/collab/${groupId}/share-lead/${leadToShare}`);
            setLeadToShare('');
            fetchData();
        } catch (error) {
            alert('Failed to share lead: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const isOwner = currentUser && group && currentUser._id === group.owner._id;

    if (loading) return <div className="text-center p-8">Loading group details...</div>;
    if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
    if (!group) return <div className="text-center p-8">Group not found.</div>;
    
    return (
        <div className="max-w-4xl mx-auto p-4">
            <button onClick={() => navigate('/groups')} className="text-blue-600 hover:underline mb-4">&larr; Back to Groups</button>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{group.groupName}</h1>
                    <p className="text-gray-500">Owner: {group.owner.firstName}</p>
                </div>
                {isOwner && (
                    <button onClick={handleDeleteGroup} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                        Delete Group
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shared Leads Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Shared Leads</h2>
                    {sharedLeads.length > 0 ? (
                        <ul className="divide-y">{sharedLeads.map(sl => <li key={sl._id} className="py-2">{sl.lead.leadName} <span className="text-xs text-gray-400">(by {sl.sharedBy.firstName})</span></li>)}</ul>
                    ) : <p className="text-sm text-gray-500">No leads have been shared in this group yet.</p>}
                    
                    <form onSubmit={handleShareLead} className="mt-4 border-t pt-4">
                        <h3 className="font-semibold mb-2">Share a Lead</h3>
                        <select value={leadToShare} onChange={e => setLeadToShare(e.target.value)} className="w-full p-2 border rounded mb-2">
                            <option value="">Select a lead to share...</option>
                            {availableLeads.map(lead => <option key={lead._id} value={lead._id}>{lead.leadName}</option>)}
                        </select>
                        <button type="submit" disabled={!leadToShare || isSubmitting} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
                            {isSubmitting ? 'Sharing...' : 'Share Lead'}
                        </button>
                    </form>
                </div>
                
                {/* Members and Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Members ({group.collaborators.length + 1})</h2>
                    <ul className="divide-y">
                        <li className="py-2 font-semibold">{group.owner.firstName} (Owner)</li>
                        {group.collaborators.map(c => (
                            <li key={c._id} className="py-2 flex justify-between items-center">
                                {c.firstName}
                                {isOwner && (
                                    <button onClick={() => handleRemoveCollaborator(c._id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                                )}
                            </li>
                        ))}
                    </ul>
                    
                    {isOwner && (
                        <form onSubmit={handleAddCollaborator} className="mt-4 border-t pt-4">
                            <h3 className="font-semibold mb-2">Add Collaborator</h3>
                            <input value={collaboratorEmail} onChange={e => setCollaboratorEmail(e.target.value)} placeholder="User's email address" className="w-full p-2 border rounded mb-2" />
                            <button type="submit" disabled={isSubmitting} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-green-300 transition-colors">
                                {isSubmitting ? 'Adding...' : 'Add Collaborator'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupDetailsPage;