import React, { useState, useEffect } from 'react';
import api from '../api/api';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// Using the same styles for consistency
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
  body { font-family: 'Poppins', sans-serif; background-color: #F4F1EC; color: #2C2C2C; }
`;
const fadeIn = keyframes` from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } `;
const PageWrapper = styled.div` max-width: 1000px; margin: 0 auto; padding: 40px 20px; animation: ${fadeIn} 0.5s ease-out; `;
const PrimaryButton = styled.button` padding: 10px 18px; background-color: #2C2C2C; color: #F4F1EC; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: transform 0.2s ease; &:disabled { background-color: #888; cursor: not-allowed; } &:hover:not(:disabled) { transform: translateY(-2px); } `;

// Profile Specific Styles
const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  background-color: #FDFCF9;
  padding: 30px;
  border-radius: 16px;
  border: 1px solid #E0DBCF;
  margin-bottom: 30px;
`;
const ProfileAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;
const ProfileInfo = styled.div`
  flex-grow: 1;
`;
const ProfileName = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin-bottom: 5px;
`;

// --- NEW: Styled component for the user's handle ---
const ProfileHandle = styled.p`
  color: #888;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 10px;
  margin-top: -5px;
`;

const ProfileEmail = styled.p`
  color: #555;
  margin-bottom: 15px;
`;
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;
const StatCard = styled.div`
  background-color: #FDFCF9;
  padding: 25px;
  border-radius: 16px;
  border: 1px solid #E0DBCF;
  text-align: center;
`;
const StatValue = styled.p`
  font-size: 2.5rem;
  font-weight: 600;
  color: #2C2C2C;
`;
const StatLabel = styled.p`
  font-size: 0.9rem;
  color: #555;
`;
const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  margin-bottom: 20px;
  border-bottom: 1px solid #E0DBCF;
  padding-bottom: 10px;
`;
const ActivityList = styled.ul`
  list-style: none;
  background-color: #FDFCF9;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #E0DBCF;
`;
const ActivityItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  &:not(:last-child) {
    border-bottom: 1px solid #F4F1EC;
  }
`;

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [userRes, statsRes, activityRes] = await Promise.all([
                    api.get('/profile/view'),
                    api.get('/profile/stats'),
                    api.get('/trackings?limit=5') // Fetch 5 most recent activities
                ]);
                setUser(userRes.data);
                setStats(statsRes.data);
                setRecentActivity(activityRes.data);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    if (loading) return <div>Loading Profile...</div>;
    if (!user || !stats) return <div>Could not load profile data.</div>;

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <ProfileHeader>
                    <ProfileAvatar src={user.photoUrl} alt="Profile" />
                    <ProfileInfo>
                        <ProfileName>{user.firstName} {user.lastName}</ProfileName>
                        
                        {/* --- NEW: Display the user's handle --- */}
                        {user.username && user.discriminator && (
                            <ProfileHandle>{user.username}-{user.discriminator}</ProfileHandle>
                        )}
                        
                        <ProfileEmail>{user.emailId}</ProfileEmail>
                        <PrimaryButton>Edit Profile</PrimaryButton>
                    </ProfileInfo>
                </ProfileHeader>

                <StatsGrid>
                    <StatCard>
                        <StatValue>{stats.totalTracked}</StatValue>
                        <StatLabel>Emails Tracked</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{stats.responseRate}%</StatValue>
                        <StatLabel>Response Rate</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{stats.leadsCreated}</StatValue>
                        <StatLabel>Leads Created</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{stats.leadsShared}</StatValue>
                        <StatLabel>Leads Shared</StatLabel>
                    </StatCard>
                </StatsGrid>

                <SectionTitle>Recent Activity</SectionTitle>
                <ActivityList>
                    {recentActivity.length > 0 ? recentActivity.map(activity => (
                        <ActivityItem key={activity._id}>
                            <div>
                                <p>Sent to: <strong>{activity.to}</strong></p>
                                <p style={{ fontSize: '0.8rem', color: '#888' }}>
                                    On {new Date(activity.sentAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span style={{ textTransform: 'capitalize', fontWeight: '600', fontSize: '0.9rem' }}>
                                {activity.status}
                            </span>
                        </ActivityItem>
                    )) : <p>No recent activity found.</p>}
                </ActivityList>

            </PageWrapper>
        </>
    );
};

export default ProfilePage;