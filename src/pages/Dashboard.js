import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import axios from 'axios';
import { Typography, Button, Avatar, Layout, Card, Row, Col, Alert, Spin, message, Modal, Tag, Tooltip } from 'antd';
import { GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';
import { EditOutlined, DeleteOutlined, LogoutOutlined } from '@ant-design/icons';
import BusinessCard from '../components/BusinessCard';
import FranchiseCard from '../components/FranchiseCard';
import CreateBusinessListing from '../pages/CreateBusinessListing';
import CreateFranchiseOpportunity from '../pages/CreateFranchiseListing';

const { Title, Text } = Typography;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isBusinessModalVisible, setIsBusinessModalVisible] = useState(false);
  const [isFranchiseModalVisible, setIsFranchiseModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser({
          displayName: currentUser.displayName,
          email: currentUser.email,
          uid: currentUser.uid,
          createdAt: currentUser.metadata.creationTime
        });
        await fetchListings(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchListings = async (useruid) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/listings`, { 
        params: { useruid } 
      });
      setListings(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to fetch listings.");
      setIsLoading(false);
    }
  };

  const handleDeleteListing = async (id, type) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this listing?',
      content: 'This action cannot be undone.',
      async onOk() {
        try {
          await axios.delete(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/listings/${id}`, { params: { type } });
          message.success("Listing deleted successfully");
          fetchListings(user.uid);
        } catch (error) {
          console.error("Error deleting listing: ", error);
          message.error("Error deleting listing");
        }
      },
    });
  };

  const handleEditListing = (listing) => {
    setInitialValues(listing);
    if (listing.type === 'business') {
      setIsBusinessModalVisible(true);
    } else {
      setIsFranchiseModalVisible(true);
    }
    setIsEditing(true);
  };

  const reauthenticate = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await reauthenticateWithPopup(auth.currentUser, provider);
      message.success('Re-authentication successful');
      handleDeleteAccount(true);
    } catch (error) {
      message.error('Re-authentication failed. Please try again.');
      console.error('Re-authentication error:', error);
    }
  };

  const deleteAllUserListings = async () => {
    try {
      const listingsToDelete = listings.filter(listing => listing.useruid === user?.uid);
      const deletePromises = listingsToDelete.map(listing => axios.delete(`http://localhost:5001/api/listings/${listing.uuid}`, { params: { type: listing.type } }));
      await Promise.all(deletePromises);
      message.success("All user listings deleted successfully");
    } catch (error) {
      console.error("Error deleting user listings: ", error);
      message.error("Error deleting user listings");
    }
  };

  const handleDeleteAccount = async (skipReauth = false) => {
    if (!skipReauth) {
      Modal.confirm({
        title: 'Are you sure you want to delete your account?',
        content: 'All your data will be permanently deleted. This action cannot be undone.',
        async onOk() {
          try {
            await deleteAllUserListings();
            await auth.currentUser.delete();
            message.success('Account and all associated listings deleted successfully');
            navigate('/');
          } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
              reauthenticate();
            } else {
              message.error('Failed to delete account');
              console.error('Account deletion error:', error);
            }
          }
        }
      });
    } else {
      try {
        await deleteAllUserListings();
        await auth.currentUser.delete();
        message.success('Account and all associated listings deleted successfully');
        navigate('/');
      } catch (error) {
        message.error('Failed to delete account');
        console.error('Account deletion error:', error);
      }
    }
  };

  const signOutUser = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out: " + error.message);
    }
  };

  const showMessage = (type) => {
    message.success(`${type} successfully submitted`);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Tooltip title="Give our Admins 2-4 Business Days to Review your Listing">
            <Tag color="yellow" style={{ color: 'black' }}>In Review</Tag>
          </Tooltip>
        );
      case 'denied':
        return (
          <Tooltip title="Your listing has been denied. Please edit it for reapproval.">
            <Tag color="red" style={{ color: 'black' }}>Denied</Tag>
          </Tooltip>
        );
      case 'approved':
        return (
          <Tooltip title="Your listing has been approved and is now live on the platform.">
            <Tag color="green" style={{ color: 'black' }}>Approved</Tag>
          </Tooltip>
        );
      default:
        return (
          <Tooltip title="Status not available.">
            <Tag color="gray" style={{ color: 'black' }}>N/A</Tag>
          </Tooltip>
        );
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Layout style={{ padding: '24px 48px', backgroundColor: 'white' }}>
        <Row gutter={16} justify="center">
          {/* Account Section */}
          <Col xs={24} md={12} lg={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Avatar size={56} style={{ backgroundColor: '#f56a00', marginRight: '20px' }}>
                  {user?.displayName?.charAt(0)}
                </Avatar>
                <div>
                  <Text strong>{user?.displayName}</Text>
                  <br />
                  <Text>{user?.email}</Text>
                  <br />
                  <Text>Account created on {formatDate(user?.createdAt)}</Text>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="primary" danger onClick={() => handleDeleteAccount()} style={{ marginRight: 8 }}>
                  Delete Account
                </Button>
                <Button danger onClick={signOutUser} icon={<LogoutOutlined />}>
                  Logout
                </Button>
              </div>
            </Card>
          </Col>
          {/* Create Listing Card */}
          <Col xs={24} md={12} lg={6}>
            <Card style={{ textAlign: "center" }}>
              <Text>Create your listing! 🚀</Text>
              <br />
              <Text>Help others find you by creating a listing below</Text>
              <br />
              <Button
                type="primary"
                onClick={() => {
                  setIsEditing(false);
                  setInitialValues(null);
                  setIsBusinessModalVisible(true);
                }}
                style={{ marginTop: '10px', marginRight: '10px' }}>
                Create Business Listing
              </Button>
              <Button
                danger
                onClick={() => {
                  setIsEditing(false);
                  setInitialValues(null);
                  setIsFranchiseModalVisible(true);
                }}
                style={{ marginTop: '10px' }}>
                Create Franchise Listing
              </Button>
            </Card>
          </Col>
        </Row>
        {listings.length > 0 && (
          <Row justify="center" style={{ marginTop: '20px' }}>
            <Col className="row mt-3 justify-content-center">
              <Title level={4}>My Listings</Title>

              {error && <Alert type="error" message={error} />}
              {isLoading ? (
                <Spin size="large" />
              ) : (
                <Row justify="start">
                  {listings.map(listing => (
                    <Col key={listing.uuid} xs={24} md={16}>
                      <Card
                        actions={[
                          <Button type="primary" style={{ backgroundColor: 'green', borderColor: 'green' }} onClick={() => handleEditListing(listing)} icon={<EditOutlined />}>
                            Edit
                          </Button>,
                          <Button danger type="primary" onClick={() => handleDeleteListing(listing.uuid, listing.type)} icon={<DeleteOutlined />}>
                            Delete
                          </Button>
                        ]}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            Created: {formatDate(listing.created_at)}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            Status: {getStatusTag(listing.status)}
                          </div>
                        </div>
                        {listing.type === 'business' ? (
                          <BusinessCard business={listing} />
                        ) : (
                          <FranchiseCard franchise={listing} />
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Col>
          </Row>
        )}
      </Layout>

      <Modal
        title={isEditing ? "Edit Business Listing" : "Create Business Listing"}
        visible={isBusinessModalVisible}
        onCancel={() => setIsBusinessModalVisible(false)}
        footer={null}
        style={{ top: 20 }}
        width={window.innerWidth <= 768 ? '100%' : '80%'}
        maskClosable={false} // Prevent closing by clicking outside
        closable={true} // Allow closing by pressing Esc key or clicking X button
      >
        <CreateBusinessListing
          initialValues={isEditing ? initialValues : null}
          onCancel={() => setIsBusinessModalVisible(false)}
          onSuccess={(type) => {
            setIsBusinessModalVisible(false);
            fetchListings(user.uid);
            showMessage(type);
          }}
          onSave={(updatedValues) => {
            setIsBusinessModalVisible(false);
            fetchListings(user.uid);
            showMessage('Listing Updated');
          }}
        />
      </Modal>

      <Modal
        title={isEditing ? "Edit Franchise Listing" : "Create Franchise Listing"}
        visible={isFranchiseModalVisible}
        onCancel={() => setIsFranchiseModalVisible(false)}
        footer={null}
        style={{ top: 20 }}
        width={window.innerWidth <= 768 ? '100%' : '80%'}
        maskClosable={false} // Prevent closing by clicking outside
        closable={true} // Allow closing by pressing Esc key or clicking X button
      >
        <CreateFranchiseOpportunity
          initialValues={isEditing ? initialValues : null}
          onCancel={() => setIsFranchiseModalVisible(false)}
          onSuccess={(type) => {
            setIsFranchiseModalVisible(false);
            fetchListings(user.uid);
            showMessage(type);
          }}
          onSave={(updatedValues) => {
            setIsFranchiseModalVisible(false);
            fetchListings(user.uid);
            showMessage('Listing Updated');
          }}
        />
      </Modal>
    </>
  );
}

export default Dashboard;
