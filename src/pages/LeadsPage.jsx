import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import Modal from '../components/common/Modal.jsx';

const LeadsPage = () => {
    const [myLeads, setMyLeads] = useState([]);
    const [allLeads, setAllLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLead, setNewLead] = useState({ leadName: '', LeadEmailId: '', phone: '', source: '', notes: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [myLeadsRes, allLeadsRes] = await Promise.all([
                api.get('/user/lead/data'),
                api.get('/lead/data/all')
            ]);
            setMyLeads(myLeadsRes.data.data);
            setAllLeads(allLeadsRes.data.data);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);
    
    const handleInputChange = (e) => setNewLead({ ...newLead, [e.target.name]: e.target.value });

    const handleCreateLead = async (e) => {
        e.preventDefault();
        try {
            await api.post('/lead/data', newLead);
            setIsModalOpen(false);
            setNewLead({ leadName: '', LeadEmailId: '', phone: '', source: '', notes: '' });
            fetchData(); // Refresh data
        } catch (error) {
            alert('Failed to create lead: ' + (error.response?.data?.message || error.message));
        }
    };
    
    const renderLeadTable = (title, leads) => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {leads.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Source</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map(lead => (
                                <tr key={lead._id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{lead.leadName}</td>
                                    <td className="px-6 py-4">{lead.LeadEmailId}</td>
                                    <td className="px-6 py-4">{lead.source}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <p className="text-center text-gray-500 py-4">No leads found.</p>}
        </div>
    );
    
    if (loading) return <div className="text-center">Loading leads...</div>

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Leads Dashboard</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Add New Lead</button>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Lead">
                <form onSubmit={handleCreateLead} className="space-y-4">
                    <input name="leadName" value={newLead.leadName} onChange={handleInputChange} placeholder="Lead Name" className="w-full p-2 border rounded" required />
                    <input name="LeadEmailId" type="email" value={newLead.LeadEmailId} onChange={handleInputChange} placeholder="Lead Email" className="w-full p-2 border rounded" />
                    <input name="phone" value={newLead.phone} onChange={handleInputChange} placeholder="Phone" className="w-full p-2 border rounded" />
                    <input name="source" value={newLead.source} onChange={handleInputChange} placeholder="Source (e.g., Linkedin.com)" className="w-full p-2 border rounded" />
                    <textarea name="notes" value={newLead.notes} onChange={handleInputChange} placeholder="Notes" className="w-full p-2 border rounded"></textarea>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Create Lead</button>
                </form>
            </Modal>

            <div className="space-y-8">
                {renderLeadTable("My Leads", myLeads)}
                {renderLeadTable("All Public Leads", allLeads)}
            </div>
        </div>
    );
};

export default LeadsPage;

