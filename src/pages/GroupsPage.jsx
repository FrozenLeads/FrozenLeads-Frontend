import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import Modal from '../components/common/Modal';
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
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; `;
const PageTitle = styled.h1` font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; `;
const CreateButton = styled.button`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px; background-color: #2C2C2C; color: #FDFCF9;
  border: none; border-radius: 8px; font-size: 1rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s ease;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
`;
const StateWrapper = styled.div` display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; color: #555; min-height: 50vh; `;
const Spinner = styled.div` width: 40px; height: 40px; border: 4px solid rgba(44, 44, 44, 0.1); border-left-color: #2C2C2C; border-radius: 50%; animation: ${spin} 1s linear infinite; margin-bottom: 15px; `;
const EmptyStateText = styled.h3` font-size: 1.25rem; font-weight: 500; color: #2C2C2C; margin-top: 20px; margin-bottom: 8px; `;

// --- Group Card Components ---
const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;
const GroupCardLink = styled(Link)`
  display: block;
  background-color: #FDFCF9;
  border: 1px solid #E0DBCF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
  }
`;
const GroupName = styled.h3` font-size: 1.4rem; font-weight: 600; color: #2C2C2C; margin-bottom: 15px; `;
const CardMeta = styled.div` display: flex; flex-direction: column; gap: 8px; `;
const MetaItem = styled.div` display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #555; svg { width: 16px; height: 16px; stroke: #888; } `;

// --- Modal Form Components ---
const Form = styled.form` display: flex; flex-direction: column; gap: 20px; `;
const Input = styled.input` width: 100%; border: none; border-bottom: 1px solid #C4C4C4; background: transparent; padding: 10px 5px; font-size: 1rem; color: #2C2C2C; font-family: 'Poppins', sans-serif; transition: border-color 0.3s ease; &:focus { outline: none; border-color: #2C2C2C; } `;
const SubmitButton = styled.button` padding: 12px; background-color: #2C2C2C; color: #F4F1EC; border: none; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: transform 0.2s ease; &:disabled { background-color: #888; cursor: not-allowed; } &:hover:not(:disabled) { transform: translateY(-2px); } `;
const ModalError = styled.p` color: #D8000C; font-size: 0.9rem; text-align: center; `;

// --- SVG Icons ---
const AddIcon = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> );
const OwnerIcon = () => ( <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> );
const MembersIcon = () => ( <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> );
const EmptyIcon = () => ( <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> );

const GroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchGroups = async () => {
        setLoading(true);
        setError(''); // Reset error on each fetch
        try {
            const res = await api.get('/collab/my');
            setGroups(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch groups", error);
            setError('Could not load your groups. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { fetchGroups() }, []);
    
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await api.post('/collab/create', { groupName });
            setIsModalOpen(false);
            setGroupName('');
            fetchGroups();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create group.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // CORRECTED RENDER LOGIC
    if (loading) return <StateWrapper><Spinner />Loading groups...</StateWrapper>;
    if (error && groups.length === 0) return <StateWrapper>{error}</StateWrapper>;

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <Header>
                    <PageTitle>Collaboration Groups</PageTitle>
                    <CreateButton onClick={() => setIsModalOpen(true)}>
                        <AddIcon /> Create Group
                    </CreateButton>
                </Header>
                
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Group">
                    <Form onSubmit={handleCreateGroup}>
                        <Input 
                            value={groupName} 
                            onChange={(e) => setGroupName(e.target.value)} 
                            placeholder="Enter group name..." 
                            required 
                        />
                        {error && !isSubmitting && <ModalError>{error}</ModalError>}
                        <SubmitButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </SubmitButton>
                    </Form>
                </Modal>
                
                {groups.length > 0 ? (
                    <GroupsGrid>
                        {groups.map(group => (
                            <GroupCardLink key={group._id} to={`/groups/${group._id}`}>
                                <GroupName>{group.groupName}</GroupName>
                                <CardMeta>
                                    <MetaItem>
                                        <OwnerIcon />
                                        <span>Owner: {group.owner.firstName}</span>
                                    </MetaItem>
                                    <MetaItem>
                                        <MembersIcon />
                                        <span>Members: {group.collaborators.length + 1}</span>
                                    </MetaItem>
                                </CardMeta>
                            </GroupCardLink>
                        ))}
                    </GroupsGrid>
                ) : (
                    <StateWrapper>
                        <EmptyIcon />
                        <EmptyStateText>You haven't joined any groups yet.</EmptyStateText>
                        <p>Click "Create Group" to start collaborating with your team.</p>
                    </StateWrapper>
                )}
            </PageWrapper>
        </>
    );
};

export default GroupsPage;