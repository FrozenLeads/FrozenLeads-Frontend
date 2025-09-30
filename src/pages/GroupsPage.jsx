import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Modal from '../components/common/Modal';

const GroupsPage = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const res = await api.get('/collab/my');
            setGroups(res.data.data);
        } catch (error) {
            console.error("Failed to fetch groups", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { fetchGroups() }, []);
    
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await api.post('/collab/create', { groupName });
            setIsModalOpen(false);
            setGroupName('');
            fetchGroups();
        } catch (error) {
            alert('Failed to create group: ' + (error.response?.data?.message || error.message));
        }
    };
    
    if (loading) return <div className="text-center">Loading groups...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Collaboration Groups</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Create Group</button>
            </div>
            
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Group">
                <form onSubmit={handleCreateGroup}>
                    <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Group Name" className="w-full p-2 border rounded mb-4" required />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Create</button>
                </form>
            </Modal>
            
            {groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <div key={group._id} className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow" onClick={() => navigate(`/groups/${group._id}`)}>
                            <h3 className="text-lg font-semibold text-blue-700">{group.groupName}</h3>
                            <p className="text-sm text-gray-500">Owner: {group.owner.firstName}</p>
                            <p className="text-sm text-gray-500">Members: {group.collaborators.length + 1}</p>
                        </div>
                    ))}
                </div>
            ) : <p className="text-center text-gray-500 p-6 bg-white rounded-lg shadow-md">You are not part of any collaboration groups yet.</p>}
        </div>
    );
};

export default GroupsPage;
