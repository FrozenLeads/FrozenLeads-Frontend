import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// A simple custom hook for debouncing search input
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

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
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
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

const statusColors = {
    sent: { bg: '#EBF4FF', text: '#3B82F6', border: '#BEE3F8' },
    responded: { bg: '#D1FAE5', text: '#059669', border: '#A7F3D0' },
    ghosted: { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
    'follow-up': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    'Engaged': { bg: '#E0E7FF', text: '#4F46E5', border: '#C7D2FE' },
    'revived': { bg: '#E0E7FF', text: '#4F46E5', border: '#C7D2FE' },
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
  text-transform: capitalize;
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

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #E0DBCF;
  background-color: #FDFCF9;
  margin-bottom: 30px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    outline: none;
    border-color: #2C2C2C;
    box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.1);
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 16px 24px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #555;
  border-bottom: 1px solid #E0DBCF;
`;

const Td = styled.td`
  padding: 16px 24px;
  border-bottom: 1px solid #E0DBCF;
  vertical-align: middle;
`;

const Tr = styled.tr`
  &:last-child ${Td} {
    border-bottom: none;
  }
`;

const NameInput = styled.input`
  border: 1px solid #ccc;
  padding: 6px 8px;
  border-radius: 6px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  width: 150px;
`;

const NameButton = styled.button`
  background: none;
  border: none;
  color: #3B82F6;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0;
  &:hover { text-decoration: underline; }
`;

// --- SVG Icons ---
const SyncIcon = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L20.5 10M3.5 14a9 9 0 0 0 14.85 3.36L20.5 14"/></svg> );
const EmptyIcon = () => ( <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" strokeWidth="1.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> );
const CloseIcon = () => ( <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg> );


const TrackingsPage = () => {
    const [trackings, setTrackings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');

    useEffect(() => {
        const fetchTrackings = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/trackings?search=${debouncedSearchTerm}`);
                setTrackings(res.data);
            } catch (err) {
                console.error("Tracking fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrackings();
    }, [debouncedSearchTerm]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await api.post('/sync-status');
            const res = await api.get(`/trackings?search=${debouncedSearchTerm}`);
            setTrackings(res.data);
        } catch (err) {
            console.error('Sync failed:', err);
            alert('Failed to sync email statuses.');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSetStatus = async (trackingId, newStatus) => {
        try {
            const res = await api.patch(`/tracking/${trackingId}/status`, { status: newStatus });
            setTrackings(prevTrackings =>
                prevTrackings.map(t =>
                    t._id === trackingId ? res.data : t
                )
            );
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status.');
        }
    };
    
    const handleNameUpdate = async (trackingId) => {
        try {
            const res = await api.patch(`/tracking/${trackingId}/name`, { name: editingName });
            setTrackings(prev => prev.map(t => t._id === trackingId ? res.data : t));
            setEditingId(null);
        } catch (error) {
            alert("Failed to update name.");
            setEditingId(null);
        }
    };

    const startEditing = (tracking) => {
        setEditingId(tracking._id);
        setEditingName(tracking.name || '');
    };

    const formatStatusText = (status) => {
        return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading && trackings.length === 0) {
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

                <SearchInput
                    type="text"
                    placeholder="Search by custom name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <ContentCard>
                    {trackings.length > 0 ? (
                        <TableWrapper>
                            <Table>
                                <thead>
                                    <tr>
                                        <Th>Name (Custom)</Th>
                                        <Th>Recipient</Th>
                                        <Th>Subject</Th>
                                        <Th>Status</Th>
                                        <Th>Actions</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trackings.map(tracking => (
                                        <Tr key={tracking._id}>
                                            <Td>
                                                {editingId === tracking._id ? (
                                                    <NameInput
                                                        type="text"
                                                        value={editingName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                        onBlur={() => handleNameUpdate(tracking._id)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleNameUpdate(tracking._id)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <NameButton onClick={() => startEditing(tracking)}>
                                                        {tracking.name || 'Add Name'}
                                                    </NameButton>
                                                )}
                                            </Td>
                                            <Td>{tracking.to}</Td>
                                            <Td>{tracking.subject || '(No Subject)'}</Td>
                                            <Td>
                                                <StatusBadge status={tracking.status}>
                                                    {formatStatusText(tracking.status)}
                                                </StatusBadge>
                                            </Td>
                                            <Td>
                                                {['sent', 'ghosted', 'follow-up', 'Engaged', 'responded', 'revived'].includes(tracking.status) && (
                                                    <MarkStatusButton onClick={() => handleSetStatus(tracking._id, 'not-interested')} title="Mark as Not Interested">
                                                        <CloseIcon />
                                                    </MarkStatusButton>
                                                )}
                                            </Td>
                                        </Tr>
                                    ))}
                                </tbody>
                            </Table>
                        </TableWrapper>
                    ) : (
                        <StateWrapper>
                            <EmptyIcon />
                            <EmptyStateText>No Tracked Emails Found</EmptyStateText>
                            <p>Try adjusting your search or send an email from the "Drafts" page.</p>
                        </StateWrapper>
                    )}
                </ContentCard>
            </PageWrapper>
        </>
    );
};

export default TrackingsPage;