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
  max-width: 1000px;
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

const SyncButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #2C2C2C;
  color: #FDFCF9;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  &:disabled { background-color: #888; cursor: not-allowed; }
`;

const ContentCard = styled.div`
  background-color: #FDFCF9;
  border: 1px solid #E0DBCF;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  overflow: hidden;
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
  width: 40px; height: 40px;
  border: 4px solid rgba(44, 44, 44, 0.1);
  border-left-color: #2C2C2C;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 15px;
`;

const EmptyStateText = styled.h3`
  font-size: 1.25rem; font-weight: 500; color: #2C2C2C;
  margin-top: 20px; margin-bottom: 8px;
`;

const TrackingsList = styled.ul`
  list-style: none;
`;

const TrackingItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid #E0DBCF;
  transition: background-color 0.2s ease;

  &:last-child { border-bottom: none; }
  &:hover { background-color: rgba(44, 44, 44, 0.02); }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TrackingInfo = styled.div` min-width: 0; `;
const TrackingSubject = styled.p` font-weight: 500; color: #2C2C2C; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; `;
const TrackingRecipient = styled.p` font-size: 0.9rem; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; `;
const TrackingDate = styled.p` font-size: 0.8rem; color: #888; margin-top: 4px; `;

const TrackingActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  
  @media (min-width: 768px) {
    margin-top: 0;
    margin-left: 20px;
  }
`;

// --- Status Badge Component (A cleaner approach) ---
const statusColors = {
    sent: { bg: '#EBF4FF', text: '#3B82F6', border: '#BEE3F8' },
    responded: { bg: '#D1FAE5', text: '#059669', border: '#A7F3D0' },
    ghosted: { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
    'follow-up': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    'Engaged': { bg: '#E0E7FF', text: '#4F46E5', border: '#C7D2FE' },
    'not-interested': { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' },
};

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid;
  white-space: nowrap;
  
  background-color: ${props => (statusColors[props.status] || statusColors['not-interested']).bg};
  color: ${props => (statusColors[props.status] || statusColors['not-interested']).text};
  border-color: ${props => (statusColors[props.status] || statusColors['not-interested']).border};
`;

const MarkStatusButton = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  background: none; border: 1px solid #D1D5DB; border-radius: 50%;
  cursor: pointer; transition: all 0.2s ease;

  svg { width: 14px; height: 14px; stroke: #6B7280; transition: stroke 0.2s ease; }

  &:hover {
    border-color: #DC2626;
    background-color: rgba(220, 38, 38, 0.05);
    svg { stroke: #DC2626; }
  }
`;

// --- SVG Icons ---
const SyncIcon = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L20.5 10M3.5 14a9 9 0 0 0 14.85 3.36L20.5 14"/></svg> );
const EmptyIcon = () => ( <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" strokeWidth="1.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> );
const CloseIcon = () => ( <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg> );


// --- TrackingsPage Component ---
const TrackingsPage = () => {
    const [trackings, setTrackings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    const fetchTrackings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/trackings');
            setTrackings(res.data);
        } catch (err) { console.error("Tracking fetch error:", err); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchTrackings(); }, [fetchTrackings]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await api.post('/sync-status');
            await fetchTrackings();
        } catch (err) {
            console.error('Sync failed:', err);
            alert('Failed to sync email statuses.');
        } finally { setIsSyncing(false); }
    };

    const handleSetStatus = async (trackingId, newStatus) => {
        try {
            await api.patch(`/track/${trackingId}/status`, { status: newStatus });
            setTrackings(prevTrackings =>
                prevTrackings.map(t =>
                    t._id === trackingId ? { ...t, status: newStatus } : t
                )
            );
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status.');
        }
    };

    const formatStatusText = (status) => {
        return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return <StateWrapper><Spinner />Loading tracked emails...</StateWrapper>;
    }

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <Header>
                    <PageTitle>Tracked Emails</PageTitle>
                    <SyncButton onClick={handleSync} disabled={isSyncing}>
                        <SyncIcon />
                        {isSyncing ? 'Syncing...' : 'Sync Status'}
                    </SyncButton>
                </Header>
                <ContentCard>
                    {trackings.length > 0 ? (
                        <TrackingsList>
                            {trackings.map(tracking => (
                                <TrackingItem key={tracking._id}>
                                    <TrackingInfo>
                                        <TrackingSubject>{tracking.subject || '(No Subject)'}</TrackingSubject>
                                        <TrackingRecipient>To: {tracking.to}</TrackingRecipient>
                                        <TrackingDate>Sent: {new Date(tracking.sentAt).toLocaleString()}</TrackingDate>
                                    </TrackingInfo>
                                    <TrackingActions>
                                        <StatusBadge status={tracking.status}>
                                            {formatStatusText(tracking.status)}
                                        </StatusBadge>
                                        {['sent', 'ghosted', 'follow-up', 'Engaged', 'responded'].includes(tracking.status) && (
                                            <MarkStatusButton
                                                onClick={() => handleSetStatus(tracking._id, 'not-interested')}
                                                title="Mark as Not Interested"
                                            >
                                               <CloseIcon />
                                            </MarkStatusButton>
                                        )}
                                    </TrackingActions>
                                </TrackingItem>
                            ))}
                        </TrackingsList>
                    ) : (
                        <StateWrapper>
                            <EmptyIcon />
                            <EmptyStateText>No emails are being tracked.</EmptyStateText>
                            <p>Emails you send from the "Drafts" page will appear here.</p>
                        </StateWrapper>
                    )}
                </ContentCard>
            </PageWrapper>
        </>
    );
};

export default TrackingsPage;