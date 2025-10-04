import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import Modal from '../components/common/Modal.jsx'; // Assuming Modal is in this path
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// --- Global Styles & Fonts ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
  body { font-family: 'Poppins', sans-serif; background-color: #F4F1EC; color: #2C2C2C; }
`;

// --- Keyframe Animations ---
const fadeIn = keyframes` from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } `;
const spin = keyframes` to { transform: rotate(360deg); } `;

// --- Page Layout Components ---
const PageWrapper = styled.div` max-width: 1200px; margin: 0 auto; padding: 40px 20px; animation: ${fadeIn} 0.5s ease-out; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; `;
const PageTitle = styled.h1` font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; `;
const AddButton = styled.button`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px; background-color: #2C2C2C; color: #FDFCF9;
  border: none; border-radius: 8px; font-size: 1rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s ease;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
`;
const StateWrapper = styled.div` display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; color: #555; min-height: 300px; `;
const Spinner = styled.div` width: 40px; height: 40px; border: 4px solid rgba(44, 44, 44, 0.1); border-left-color: #2C2C2C; border-radius: 50%; animation: ${spin} 1s linear infinite; margin-bottom: 15px; `;

// --- Tab Components ---
const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  border-bottom: 1px solid #E0DBCF;
  margin-bottom: -1px; /* To overlap with the card's border */
`;
const TabButton = styled.button`
  padding: 15px 25px;
  font-size: 1rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.isActive ? '#2C2C2C' : '#888'};
  border-bottom: 2px solid ${props => props.isActive ? '#2C2C2C' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: #2C2C2C;
  }
`;

// --- Table Components ---
const TableCard = styled.div` background-color: #FDFCF9; border: 1px solid #E0DBCF; border-radius: 16px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03); overflow: hidden; `;
const TableContainer = styled.div` overflow-x: auto; `;
const StyledTable = styled.table` width: 100%; border-collapse: collapse; `;
const TableHeader = styled.thead` background-color: rgba(44, 44, 44, 0.02); `;
const TableBody = styled.tbody``; // <<< THIS WAS THE MISSING LINE
const TableRow = styled.tr` &:not(:last-child) { border-bottom: 1px solid #E0DBCF; } `;
const TableHeaderCell = styled.th` padding: 16px 24px; text-align: left; font-size: 0.8rem; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.5px; `;
const TableCell = styled.td`
  padding: 16px 24px; font-size: 0.95rem; color: #3D3D3D;
  &.email-cell { display: flex; align-items: center; gap: 10px; }
`;
const CopyButton = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; background: none; border: none;
  border-radius: 50%; cursor: pointer; transition: background-color 0.2s ease;
  flex-shrink: 0;
  svg { width: 16px; height: 16px; stroke: #888; }
  &:hover { background-color: rgba(44, 44, 44, 0.08); }
`;

// --- Modal Form Components ---
const Form = styled.form` display: flex; flex-direction: column; gap: 20px; `;
const Input = styled.input` width: 100%; border: none; border-bottom: 1px solid #C4C4C4; background: transparent; padding: 10px 5px; font-size: 1rem; color: #2C2C2C; font-family: 'Poppins', sans-serif; transition: border-color 0.3s ease; &:focus { outline: none; border-color: #2C2C2C; } `;
const Textarea = styled.textarea` width: 100%; border: none; border-bottom: 1px solid #C4C4C4; background: transparent; padding: 10px 5px; font-size: 1rem; color: #2C2C2C; font-family: 'Poppins', sans-serif; transition: border-color 0.3s ease; resize: vertical; min-height: 80px; &:focus { outline: none; border-color: #2C2C2C; } `;
const SubmitButton = styled.button` padding: 12px; background-color: #2C2C2C; color: #F4F1EC; border: none; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: transform 0.2s ease; &:hover { transform: translateY(-2px); } `;

// --- SVG Icons ---
const AddIcon = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> );
const CopyIcon = () => ( <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const CheckIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="#228B22" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> );


const LeadsPage = () => {
    const [myLeads, setMyLeads] = useState([]);
    const [allLeads, setAllLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLead, setNewLead] = useState({ leadName: '', LeadEmailId: '', phone: '', source: '', notes: '' });
    const [copiedEmail, setCopiedEmail] = useState(null);
    const [activeTab, setActiveTab] = useState('myLeads');

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [myLeadsRes, allLeadsRes] = await Promise.all([
                api.get('/user/lead/data'),
                api.get('/lead/data/all')
            ]);
            setMyLeads(myLeadsRes.data.data || []);
            setAllLeads(allLeadsRes.data.data || []);
        } catch (error) {
            console.error("Failed to fetch leads", error);
            setError("Could not retrieve leads. Please try refreshing the page.");
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
            fetchData();
        } catch (error) {
            alert('Failed to create lead: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleCopyEmail = (email) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
    };
    
    const renderLeadTable = (leads) => (
        <>
            {leads.length > 0 ? (
                <TableContainer>
                    <StyledTable>
                        <TableHeader><TableRow>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>Email</TableHeaderCell>
                            <TableHeaderCell>Source</TableHeaderCell>
                        </TableRow></TableHeader>
                        <TableBody>
                            {leads.map(lead => (
                                <TableRow key={lead._id}>
                                    <TableCell>{lead.leadName}</TableCell>
                                    <TableCell className="email-cell">
                                        <span>{lead.LeadEmailId}</span>
                                        <CopyButton onClick={() => handleCopyEmail(lead.LeadEmailId)} title="Copy email">
                                            {copiedEmail === lead.LeadEmailId ? <CheckIcon /> : <CopyIcon />}
                                        </CopyButton>
                                    </TableCell>
                                    <TableCell>{lead.source}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>
                </TableContainer>
            ) : <StateWrapper><p>No leads found in this category.</p></StateWrapper>}
        </>
    );

    const renderContent = () => {
        if (loading) return <StateWrapper><Spinner />Loading leads...</StateWrapper>;
        if (error) return <StateWrapper>{error}</StateWrapper>;

        return (
            <>
                <TabContainer>
                    <TabButton isActive={activeTab === 'myLeads'} onClick={() => setActiveTab('myLeads')}>My Leads</TabButton>
                    <TabButton isActive={activeTab === 'allLeads'} onClick={() => setActiveTab('allLeads')}>All Public Leads</TabButton>
                </TabContainer>
                <TableCard>
                    {activeTab === 'myLeads' ? renderLeadTable(myLeads) : renderLeadTable(allLeads)}
                </TableCard>
            </>
        );
    };

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <Header>
                    <PageTitle>Leads Dashboard</PageTitle>
                    <AddButton onClick={() => setIsModalOpen(true)}>
                        <AddIcon /> Add New Lead
                    </AddButton>
                </Header>
                
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Lead">
                    <Form onSubmit={handleCreateLead}>
                        <Input name="leadName" value={newLead.leadName} onChange={handleInputChange} placeholder="Lead Name" required />
                        <Input name="LeadEmailId" type="email" value={newLead.LeadEmailId} onChange={handleInputChange} placeholder="Lead Email" />
                        <Input name="phone" value={newLead.phone} onChange={handleInputChange} placeholder="Phone" />
                        <Input name="source" value={newLead.source} onChange={handleInputChange} placeholder="Source (e.g., Linkedin.com)" />
                        <Textarea name="notes" value={newLead.notes} onChange={handleInputChange} placeholder="Notes" />
                        <SubmitButton type="submit">Create Lead</SubmitButton>
                    </Form>
                </Modal>
                
                {renderContent()}
            </PageWrapper>
        </>
    );
};

export default LeadsPage;