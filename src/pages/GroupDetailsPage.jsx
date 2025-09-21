import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const GroupDetailsPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [sharedLeads, setSharedLeads] = useState([]);
    const [myLeads, setMyLeads] = useState([]); // For sharing
    const [loading, setLoading] = useState(true);
    const [collaboratorId, setCollaboratorId] = useState('');
    const [leadToShare, setLeadToShare] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            // A dedicated backend endpoint `/collab/:groupId` would be more efficient.
            // For now, we fetch all user's groups and filter.
            const [groupsRes, sharedLeadsRes, myLeadsRes] = await Promise.all([
                api.get('/collab/my'),
                api.get(`/collab/${groupId}/leads`),
                api.get('/user/lead/data')
            ]);
            setGroup(groupsRes.data.data.find(g => g._id === groupId));
            setSharedLeads(sharedLeadsRes.data.data);
            setMyLeads(myLeadsRes.data.data.filter(lead => lead.isPublic)); // Only show shareable leads
        } catch (error) {
            console.error("Failed to fetch group details", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { fetchData(); }, [groupId]);

    const handleAddCollaborator = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/collab/${groupId}/add-collaborator`, { collaboratorId });
            setCollaboratorId('');
            fetchData();
        } catch (error) { alert('Failed to add collaborator: ' + (error.response?.data?.message || error.message)); }
    };

    const handleShareLead = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/collab/${groupId}/share-lead/${leadToShare}`);
            setLeadToShare('');
            fetchData();
        } catch (error) { alert('Failed to share lead: ' + (error.response?.data?.error || error.message)); }
    };
    
    if (loading) return <div className="text-center">Loading group details...</div>;
    if (!group) return <div className="text-center">Group not found or you do not have access.</div>;
    
    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/groups')} className="text-blue-600 hover:underline mb-4">&larr; Back to Groups</button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{group.groupName}</h1>
            <p className="text-gray-500 mb-6">Owner: {group.owner.firstName}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shared Leads Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Shared Leads</h2>
                    {sharedLeads.length > 0 ? (
                         <ul>{sharedLeads.map(sl => <li key={sl._id} className="border-b py-2">{sl.lead.leadName} <span className="text-xs text-gray-400">(Shared by {sl.sharedBy.firstName})</span></li>)}</ul>
                    ) : <p>No leads shared yet.</p>}
                     <form onSubmit={handleShareLead} className="mt-4 border-t pt-4">
                        <select value={leadToShare} onChange={e => setLeadToShare(e.target.value)} className="w-full p-2 border rounded mb-2">
                            <option value="">Select a lead to share...</option>
                            {myLeads.map(lead => <option key={lead._id} value={lead._id}>{lead.leadName}</option>)}
                        </select>
                        <button type="submit" disabled={!leadToShare} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300">Share Lead</button>
                    </form>
                </div>
                
                {/* Members and Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Members</h2>
                     <ul className="space-y-2">
                        <li>{group.owner.firstName} (Owner)</li>
                        {group.collaborators.map(c => <li key={c._id}>{c.firstName}</li>)}
                    </ul>
                    <form onSubmit={handleAddCollaborator} className="mt-4 border-t pt-4">
                         <input value={collaboratorId} onChange={e => setCollaboratorId(e.target.value)} placeholder="User ID to add" className="w-full p-2 border rounded mb-2" />
                         <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Add Collaborator</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GroupDetailsPage;
