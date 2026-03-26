import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
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
const StateWrapper = styled.div` display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; color: #555; min-height: 80vh; `;
const Spinner = styled.div` width: 40px; height: 40px; border: 4px solid rgba(44, 44, 44, 0.1); border-left-color: #2C2C2C; border-radius: 50%; animation: ${spin} 1s linear infinite; margin-bottom: 15px; `;
const BackLink = styled(Link)`
  display: inline-flex; align-items: center; gap: 8px;
  color: #555; text-decoration: none; font-weight: 500;
  margin-bottom: 20px; transition: color 0.2s ease;
  &:hover { color: #2C2C2C; }
`;
const Header = styled.div`
  display: flex; flex-direction: column; gap: 10px;
  margin-bottom: 40px;
  @media (min-width: 768px) { flex-direction: row; justify-content: space-between; align-items: flex-start; }
`;
const PageTitle = styled.h1` font-family: 'Playfair Display', serif; font-size: 2.8rem; font-weight: 700; line-height: 1.2; `;
const PageSubtitle = styled.p` color: #555; font-size: 1rem; `;
const DestructiveButton = styled.button`
  padding: 10px 20px; background-color: transparent; color: #D8000C;
  border: 1px solid #D8000C; border-radius: 8px; font-size: 0.9rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s ease;
  &:hover { background-color: #D8000C; color: #FFF; }
`;
const GridContainer = styled.div` display: grid; grid-template-columns: 1fr; gap: 30px; @media (min-width: 1024px) { grid-template-columns: 1fr 1fr; } `;

// --- Card & Form Components ---
const ContentCard = styled.div` background-color: #FDFCF9; border: 1px solid #E0DBCF; border-radius: 16px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03); overflow: hidden; `;
const CardTitle = styled.h2` font-size: 1.5rem; font-weight: 600; padding: 24px; border-bottom: 1px solid #E0DBCF; `;
const CardBody = styled.div` padding: 24px; `;
const CardSection = styled.div` &:not(:last-child) { border-bottom: 1px solid #E0DBCF; padding-bottom: 20px; margin-bottom: 20px; } `;
const SectionTitle = styled.h3` font-weight: 600; margin-bottom: 15px; color: #2C2C2C; `;
const ItemList = styled.ul` list-style: none; display: flex; flex-direction: column; gap: 15px; `;
const Item = styled.li` display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; `;
const RemoveButton = styled.button` background: none; border: none; cursor: pointer; svg { width: 20px; height: 20px; stroke: #888; transition: stroke 0.2s ease; } &:hover svg { stroke: #D8000C; } `;
const Form = styled.form` display: flex; flex-direction: column; gap: 15px; `;
const Input = styled.input` width: 100%; border: none; border-bottom: 1px solid #C4C4C4; background: transparent; padding: 10px 5px; font-size: 1rem; font-family: 'Poppins', sans-serif; transition: border-color 0.3s ease; &:focus { outline: none; border-color: #2C2C2C; } `;
const PrimaryButton = styled.button` padding: 12px; background-color: #2C2C2C; color: #F4F1EC; border: none; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: transform 0.2s ease; &:disabled { background-color: #888; cursor: not-allowed; } &:hover:not(:disabled) { transform: translateY(-2px); } `;
const SearchWrapper = styled.div` position: relative; `;
const SearchResultsList = styled.ul` position: absolute; top: 100%; left: 0; right: 0; background-color: #FFFFFF; border: 1px solid #E0DBCF; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05); list-style: none; margin-top: -2px; max-height: 200px; overflow-y: auto; z-index: 10; `;
const SearchResultItem = styled.li` padding: 12px 15px; cursor: pointer; font-size: 0.95rem; transition: background-color 0.2s ease; &:hover { background-color: #F4F1EC; } `;
const SubtleText = styled.span` font-size: 0.8rem; color: #888; margin-left: 8px; `;
const CopyButton = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; background: none; border: none;
  border-radius: 50%; cursor: pointer; transition: background-color 0.2s ease;
  flex-shrink: 0;
  svg { width: 16px; height: 16px; stroke: #888; }
  &:hover { background-color: rgba(44, 44, 44, 0.08); }
`;
const LeadInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;
const LeadName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// --- Confirmation Modal Styled Components ---
const ConfirmModalContent = styled.div` text-align: center; padding: 20px; `;
const ConfirmMessage = styled.p` font-size: 1.1rem; color: #333; margin-bottom: 30px; `;
const ButtonGroup = styled.div` display: flex; gap: 15px; justify-content: center; `;
const CancelButton = styled(PrimaryButton)`
  background-color: transparent;
  color: #555;
  border: 1px solid #C4C4C4;
  &:hover { background-color: #eee; transform: translateY(0); }
`;
const ConfirmButton = styled(DestructiveButton)`
  background-color: #D8000C;
  color: #FFF;
  &:hover { background-color: #b2000a; transform: translateY(-2px); }
`;

// --- SVG Icons ---
const BackIcon = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> );
const RemoveIcon = () => ( <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg> );
const CopyIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const CheckIcon = () => ( <svg viewBox="0 0 24 24" fill="none" stroke="#228B22" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> );


const GroupDetailsPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [sharedLeads, setSharedLeads] = useState([]);
    const [availableLeads, setAvailableLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const searchRef = useRef(null);
    const [collaboratorIdentifier, setCollaboratorIdentifier] = useState('');
    const [leadToShare, setLeadToShare] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [copiedIdentifier, setCopiedIdentifier] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
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
            const sharedLeadIds = new Set(sharedLeadsRes.data.data.map(sl => sl.lead._id));
            const available = allLeadsRes.data.data.filter(lead => !sharedLeadIds.has(lead._id));
            setAvailableLeads(available);
        } catch (error) {
            console.error("Failed to fetch group details", error);
            setError(error.response?.data?.message || 'Could not load group details.');
        } finally {
            setLoading(false);
        }
    }, [groupId]);
    
    useEffect(() => { fetchData(); }, [fetchData]);
    
    useEffect(() => {
        if (searchQuery.length > 0) {
            const filtered = availableLeads.filter(lead => lead.leadName.toLowerCase().includes(searchQuery.toLowerCase()));
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, availableLeads]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchRef]);

    const handleCopy = (textToCopy, identifier) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedIdentifier(identifier);
        toast.success('Email copied!');
        setTimeout(() => setCopiedIdentifier(null), 2000);
    };

    const handleAddCollaborator = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post(`/collab/${groupId}/add-collaborator`, { identifier: collaboratorIdentifier });
            setCollaboratorIdentifier('');
            toast.success('Collaborator added!');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add collaborator.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnshareLead = (sharedLeadId) => {
        setConfirmMessage("Are you sure you want to unshare this lead?");
        setConfirmAction(() => async () => {
            try {
                await api.delete(`/collab/${groupId}/leads/${sharedLeadId}`);
                toast.success('Lead unshared successfully!');
                fetchData();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to unshare lead.');
            }
        });
        setIsConfirmModalOpen(true);
    };

    const handleRemoveCollaborator = (collaboratorId) => {
        setConfirmMessage("Are you sure you want to remove this collaborator?");
        setConfirmAction(() => async () => {
            try {
                await api.post(`/collab/${groupId}/remove-collaborator`, { collaboratorId });
                toast.success('Collaborator removed.');
                fetchData();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to remove collaborator.');
            }
        });
        setIsConfirmModalOpen(true);
    };

    const handleDeleteGroup = () => {
        setConfirmMessage("Are you sure you want to delete this group? This action is permanent.");
        setConfirmAction(() => async () => {
            try {
                await api.delete(`/collab/${groupId}`);
                toast.success('Group deleted.');
                navigate('/groups');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete group.');
            }
        });
        setIsConfirmModalOpen(true);
    };

    const handleShareLead = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post(`/collab/${groupId}/share-lead/${leadToShare}`);
            setLeadToShare('');
            setSearchQuery('');
            toast.success('Lead shared!');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to share lead.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleSelectLead = (lead) => {
        setLeadToShare(lead._id);
        setSearchQuery(lead.leadName);
        setIsSearchVisible(false);
    };

    const executeConfirmAction = () => {
        if (confirmAction) {
            confirmAction();
        }
        setIsConfirmModalOpen(false);
    };
    
    const isOwner = currentUser && group && currentUser._id === group.owner._id;

    if (loading) return <StateWrapper><Spinner />Loading group details...</StateWrapper>;
    if (error) return <StateWrapper>{error}</StateWrapper>;
    if (!group) return <StateWrapper>Group not found.</StateWrapper>;
    
    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <BackLink to="/groups"><BackIcon /> Back to All Groups</BackLink>
                <Header>
                    <div>
                        <PageTitle>{group.groupName}</PageTitle>
                        <PageSubtitle>Owned by {group.owner.firstName}</PageSubtitle>
                    </div>
                    {isOwner && (<DestructiveButton onClick={handleDeleteGroup}>Delete Group</DestructiveButton>)}
                </Header>
                
                <GridContainer>
                    <ContentCard>
                        <CardTitle>Shared Leads</CardTitle>
                        <CardBody>
                            <CardSection>
                                {sharedLeads.length > 0 ? (
                                    <ItemList>
                                        {sharedLeads.map(sl => {
                                            const canUnshare = isOwner || (currentUser && currentUser._id === sl.sharedBy._id);
                                            return (
                                                <Item key={sl._id}>
                                                    <LeadInfo>
                                                        <LeadName>{sl.lead.leadName}</LeadName>
                                                        <CopyButton onClick={() => handleCopy(sl.lead.LeadEmailId, sl.lead._id)} title="Copy email">
                                                            {copiedIdentifier === sl.lead._id ? <CheckIcon /> : <CopyIcon />}
                                                        </CopyButton>
                                                        <SubtleText>(by {sl.sharedBy.firstName})</SubtleText>
                                                    </LeadInfo>
                                                    {canUnshare && (<RemoveButton onClick={() => handleUnshareLead(sl._id)} title="Unshare this lead"><RemoveIcon /></RemoveButton>)}
                                                </Item>
                                            );
                                        })}
                                    </ItemList>
                                ) : <p style={{color: '#555', fontSize: '0.9rem'}}>No leads have been shared yet.</p>}
                            </CardSection>
                            <Form onSubmit={handleShareLead}>
                                <SectionTitle>Share a Lead</SectionTitle>
                                <SearchWrapper ref={searchRef}>
                                    <Input
                                        type="text"
                                        placeholder="Search for a lead to share..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setIsSearchVisible(true);
                                            setLeadToShare('');
                                        }}
                                        autoComplete="off"
                                    />
                                    {isSearchVisible && searchQuery && (
                                        <SearchResultsList>
                                            {searchResults.length > 0 ? (
                                                searchResults.map(lead => (
                                                    <SearchResultItem key={lead._id} onClick={() => handleSelectLead(lead)}>
                                                        {lead.leadName}
                                                    </SearchResultItem>
                                                ))
                                            ) : (
                                                <SearchResultItem as="div" style={{ cursor: 'default', color: '#888' }}>
                                                    No leads found.
                                                </SearchResultItem>
                                            )}
                                        </SearchResultsList>
                                    )}
                                </SearchWrapper>
                                <PrimaryButton type="submit" disabled={!leadToShare || isSubmitting}>
                                    {isSubmitting ? 'Sharing...' : 'Share Lead'}
                                </PrimaryButton>
                            </Form>
                        </CardBody>
                    </ContentCard>
                    
                    <ContentCard>
                        <CardTitle>Members ({group.collaborators.length + 1})</CardTitle>
                        <CardBody>
                            <CardSection>
                                <ItemList>
                                    <Item>
                                        <div>
                                            <span>{group.owner.firstName}</span>
                                            <SubtleText>({group.owner.username}-{group.owner.discriminator}) (Owner)</SubtleText>
                                        </div>
                                    </Item>
                                    {group.collaborators.map(c => (
                                        <Item key={c._id}>
                                            <div>
                                                <span>{c.firstName}</span>
                                                <SubtleText>({c.username}-{c.discriminator})</SubtleText>
                                            </div>
                                            {isOwner && (<RemoveButton onClick={() => handleRemoveCollaborator(c._id)} title="Remove collaborator"><RemoveIcon /></RemoveButton>)}
                                        </Item>
                                    ))}
                                </ItemList>
                            </CardSection>
                            
                            {isOwner && (
                                <Form onSubmit={handleAddCollaborator}>
                                    <SectionTitle>Add Collaborator</SectionTitle>
                                    <Input 
                                        value={collaboratorIdentifier} 
                                        onChange={e => setCollaboratorIdentifier(e.target.value)} 
                                        placeholder="User's handle (e.g., jane-1234) or email" 
                                        type="text" 
                                        required 
                                    />
                                    <PrimaryButton type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Adding...' : 'Add Collaborator'}
                                    </PrimaryButton>
                                </Form>
                            )}
                        </CardBody>
                    </ContentCard>
                </GridContainer>
            </PageWrapper>

            <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Confirm Action">
                <ConfirmModalContent>
                    <ConfirmMessage>{confirmMessage}</ConfirmMessage>
                    <ButtonGroup>
                        <CancelButton onClick={() => setIsConfirmModalOpen(false)}>Cancel</CancelButton>
                        <ConfirmButton onClick={executeConfirmAction}>Confirm</ConfirmButton>
                    </ButtonGroup>
                </ConfirmModalContent>
            </Modal>
        </>
    );
};
export default GroupDetailsPage;