import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';
import { db } from '../../firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';

// Styled components for the dashboard
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #0a0a0a, #151515);
  color: #fff;
`;

const Header = styled.header`
  padding: 20px 5%;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  background: linear-gradient(135deg, #6c63ff, #ff6584);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Username = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const LogoutButton = styled(motion.button)`
  padding: 8px 16px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MainContent = styled.main`
  padding: 30px 5%;
`;

const WelcomeCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 30px;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #fff;
`;

const WelcomeMessage = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const DashboardCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  
  &:hover {
    border-color: rgba(108, 99, 255, 0.3);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #fff;
`;

const CardContent = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
`;

const ResumeSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 30px 0;
`;

const ResumeTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #fff;
`;

const ResumeDownloadButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(45deg, #6c63ff, #6259db);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    box-shadow: 0 5px 15px rgba(108, 99, 255, 0.3);
  }
`;

const Dashboard = () => {
  const { admin, isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    // Fetch resume URL from Firestore
    const fetchResumeUrl = async () => {
      try {
        const assetDocRef = doc(db, "assets", "assets");
        const assetDoc = await getDoc(assetDocRef);
        
        if (assetDoc.exists()) {
          const data = assetDoc.data();
          if (data.resume) {
            setResumeUrl(data.resume);
          }
        }
      } catch (error) {
        console.error("Error fetching resume URL:", error);
      }
    };
    
    fetchResumeUrl();
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/admin');
  };
  
  if (!isAuthenticated || !admin) {
    return null; // Don't render anything if not authenticated
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <UserInfo>
          <Username>Welcome, {admin.name} ({admin.role})</Username>
          <LogoutButton 
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </LogoutButton>
        </UserInfo>
      </Header>
      
      <MainContent>
        <WelcomeCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeTitle>Welcome to the Admin Dashboard</WelcomeTitle>
          <WelcomeMessage>
            You are logged in as {admin.name} with role {admin.role}. From here, you can manage your portfolio content, view analytics, and update your projects.
          </WelcomeMessage>
        </WelcomeCard>
        
        {resumeUrl && (
          <ResumeSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ResumeTitle>Your Resume</ResumeTitle>
            <ResumeDownloadButton 
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ rotate: 0 }}
              animate={{ 
                rotate: [0, 5, -5, 5, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "loop", 
                duration: 2,
                repeatDelay: 2
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4 10v-6" />
              </svg>
              Download Resume
            </ResumeDownloadButton>
          </ResumeSection>
        )}
        
        <DashboardGrid>
          <DashboardCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: resumeUrl ? 0.3 : 0.1 }}
          >
            <CardTitle>Portfolio Management</CardTitle>
            <CardContent>
              Update your portfolio content, projects, skills, and personal information.
            </CardContent>
          </DashboardCard>
          
          <DashboardCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: resumeUrl ? 0.4 : 0.2 }}
          >
            <CardTitle>User Messages</CardTitle>
            <CardContent>
              View and respond to messages from visitors who contacted you through your portfolio.
            </CardContent>
          </DashboardCard>
          
          <DashboardCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: resumeUrl ? 0.5 : 0.3 }}
          >
            <CardTitle>Analytics</CardTitle>
            <CardContent>
              View visitor statistics, popular pages, and engagement metrics for your portfolio.
            </CardContent>
          </DashboardCard>
        </DashboardGrid>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard; 