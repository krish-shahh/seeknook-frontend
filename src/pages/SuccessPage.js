import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite-config'; // Import Appwrite configuration
import { Typography, Button, Avatar, Layout } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

const SuccessPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await account.get();
        setUser({
          displayName: session.name || 'User',
          email: session.email,
          createdAt: session.$createdAt,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const signOutUser = async () => {
    try {
      await account.deleteSession('current');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
      alert('Failed to sign out: ' + error.message);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '50px', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Title level={4}>Account</Title>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <Avatar
              size={56}
              style={{ backgroundColor: '#f56a00', marginRight: '20px' }}
            >
              {user?.displayName?.charAt(0)}
            </Avatar>
            <div style={{ textAlign: 'left' }}>
              <Text strong>{user?.displayName}</Text>
              <br />
              <Text>{user?.email}</Text>
              <br />
              <Text>
                Account created on{' '}
                {new Date(user?.createdAt).toLocaleDateString()}
              </Text>
            </div>
          </div>
          <Button
            type="primary"
            onClick={signOutUser}
            style={{ marginTop: '20px' }}
          >
            Log Out
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default SuccessPage;
