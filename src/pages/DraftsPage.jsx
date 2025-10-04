import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api.js';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// --- Global Styles & Fonts ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #F4F1EC;
    color: #2C2C2C;
  }
`;

// --- Keyframe Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// --- Styled Components ---
const PageWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
`;

const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: transparent;
  color: #2C2C2C;
  border: 1px solid #C4C4C4;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #2C2C2C;
    background-color: rgba(44, 44, 44, 0.05);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ContentCard = styled.div`
  background-color: #FDFCF9;
  border: 1px solid #E0DBCF;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  overflow: hidden; /* To clip the list items' corners */
`;

const StateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #555;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(44, 44, 44, 0.1);
  border-left-color: #2C2C2C;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 15px;
`;

const EmptyStateText = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  color: #2C2C2C;
  margin-top: 20px;
  margin-bottom: 8px;
`;

const DraftsList = styled.ul`
  list-style: none;
`;

const DraftItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E0DBCF;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: rgba(44, 44, 44, 0.02);
  }
`;

const DraftInfo = styled.div`
  min-width: 0; /* Important for text truncation */
`;

const DraftSubject = styled.p`
  font-weight: 500;
  color: #2C2C2C;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DraftRecipient = styled.p`
  font-size: 0.9rem;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SendButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 20px;
  padding: 10px 20px;
  background-color: #2C2C2C;
  color: #FDFCF9;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0; /* Prevent button from shrinking */
  transition: all 0.2s ease;

  &:hover:not(:disabled) { transform: translateY(-2px); }
  &:disabled { background-color: #888; cursor: not-allowed; }
`;

// --- SVG Icons ---
const RefreshIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L20.5 10M3.5 14a9 9 0 0 0 14.85 3.36L20.5 14"/></svg> );
const EmptyIcon = () => ( <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" strokeWidth="1.5"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4A2 2 0 0 1 2 16.77V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z" /><polyline points="2.32 6.16 12 11 21.68 6.16" /><line x1="12" y1="22.76" x2="12" y2="11" /></svg> );
const SendIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg> );


const DraftsPage = () => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sendingId, setSendingId] = useState(null);

    const fetchDrafts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/track/drafts');
            setDrafts(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch drafts.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDrafts();
    }, [fetchDrafts]);

    const handleSendDraft = async (draftId) => {
        setSendingId(draftId);
        try {
            await api.post('/track/send-draft', { draftId });
            alert('Email sent successfully and is now being tracked!');
            fetchDrafts();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to send draft.');
        } finally {
            setSendingId(null);
        }
    };

    const renderContent = () => {
        if (loading) return (
            <StateWrapper><Spinner />Loading your drafts...</StateWrapper>
        );
        if (error) return (
            <StateWrapper>{error}</StateWrapper>
        );
        if (drafts.length === 0) {
            return (
                <StateWrapper>
                    <EmptyIcon />
                    <EmptyStateText>No drafts found.</EmptyStateText>
                    <p>Write an email in Gmail, save it as a draft, then refresh this page.</p>
                </StateWrapper>
            );
        }
        return (
            <DraftsList>
                {drafts.map((draft) => (
                    <DraftItem key={draft.id}>
                        <DraftInfo>
                            <DraftSubject title={draft.subject}>{draft.subject || "(No Subject)"}</DraftSubject>
                            <DraftRecipient title={draft.to}>To: {draft.to || "No Recipient"}</DraftRecipient>
                        </DraftInfo>
                        <SendButton
                            onClick={() => handleSendDraft(draft.id)}
                            disabled={sendingId === draft.id}
                        >
                            <SendIcon />
                            {sendingId === draft.id ? 'Sending...' : 'Send & Track'}
                        </SendButton>
                    </DraftItem>
                ))}
            </DraftsList>
        );
    };

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <Header>
                    <PageTitle>Send from Drafts</PageTitle>
                    <RefreshButton onClick={fetchDrafts} disabled={loading}>
                        <RefreshIcon />
                        Refresh
                    </RefreshButton>
                </Header>
                <ContentCard>
                    {renderContent()}
                </ContentCard>
            </PageWrapper>
        </>
    );
};

export default DraftsPage;