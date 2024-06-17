import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, message, Spin, Row, Col, Card, Popconfirm, Modal, Form, Input, Tabs, Radio, Tag } from 'antd';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import { PlusOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import BusinessCard from '../components/BusinessCard';
import FranchiseCard from '../components/FranchiseCard';
import axios from 'axios';

const { TabPane } = Tabs;

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [pendingFranchises, setPendingFranchises] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const [timeRange, setTimeRange] = useState('daily');
  const allowedEmails = ['nimitspc@gmail.com', '2003kshah@gmail.com'];
  const navigate = useNavigate();
  const resetMapRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (allowedEmails.includes(user.email)) {
          setUser(user);
          await fetchBusinesses();
          await fetchPendingBusinesses();
          await fetchFranchises();
          await fetchPendingFranchises();
          await fetchAdminMessage();
        } else {
          message.error('Access denied. You do not have permission to access this page.');
          auth.signOut();
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://seeknook-backend-2564a672bd98.herokuapp.com/api/businesses');
      setBusinesses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setLoading(false);
      message.error('Failed to fetch businesses.');
    }
  };

  const fetchPendingBusinesses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://seeknook-backend-2564a672bd98.herokuapp.com/api/businesses');
      const pendingBusinesses = response.data.filter(b => b.status === 'pending');
      setPendingBusinesses(pendingBusinesses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending businesses:', error);
      setLoading(false);
      message.error('Failed to fetch pending businesses.');
    }
  };

  const fetchFranchises = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://seeknook-backend-2564a672bd98.herokuapp.com/api/franchises');
      setFranchises(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching franchises:', error);
      setLoading(false);
      message.error('Failed to fetch franchises.');
    }
  };

  const fetchPendingFranchises = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://seeknook-backend-2564a672bd98.herokuapp.com/api/franchises');
      const pendingFranchises = response.data.filter(f => f.status === 'pending');
      setPendingFranchises(pendingFranchises);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending franchises:', error);
      setLoading(false);
      message.error('Failed to fetch pending franchises.');
    }
  };

  const fetchAdminMessage = async () => {
    try {
      const response = await axios.get('https://seeknook-backend-2564a672bd98.herokuapp.com/api/messages/admin-message');
      setAdminMessage(response.data.message);
    } catch (error) {
      console.error('Error fetching admin message:', error);
      message.error('Failed to fetch admin message.');
    }
  };

  const deleteBusiness = async (uuid) => {
    try {
      await axios.delete(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/businesses/${uuid}`);
      message.success('Business deleted successfully.');
      fetchBusinesses();
    } catch (error) {
      console.error('Error deleting business:', error);
      message.error('Failed to delete business.');
    }
  };

  const deleteFranchise = async (uuid) => {
    try {
      await axios.delete(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/franchises/${uuid}`);
      message.success('Franchise deleted successfully.');
      fetchFranchises();
    } catch (error) {
      console.error('Error deleting franchise:', error);
      message.error('Failed to delete franchise.');
    }
  };

  const updateBusinessStatus = async (uuid, status) => {
    try {
      await axios.put(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/businesses/${uuid}`, { status });
      message.success(`Business ${status === 'approved' ? 'approved' : 'denied'} successfully`);
      fetchPendingBusinesses();
    } catch (error) {
      console.error(`Error updating business status to ${status}:`, error);
      message.error(`Error updating business status to ${status}`);
    }
  };

  const updateFranchiseStatus = async (uuid, status) => {
    try {
      await axios.put(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/franchises/${uuid}`, { status });
      message.success(`Franchise ${status === 'approved' ? 'approved' : 'denied'} successfully`);
      fetchPendingFranchises();
    } catch (error) {
      console.error(`Error updating franchise status to ${status}:`, error);
      message.error(`Error updating franchise status to ${status}`);
    }
  };

  const approveAllPendingBusinesses = async () => {
    try {
      const updatePromises = pendingBusinesses.map(business => axios.put(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/businesses/${business.uuid}`, { status: 'approved' }));
      await Promise.all(updatePromises);
      message.success('All pending businesses approved successfully');
      fetchPendingBusinesses();
    } catch (error) {
      console.error('Error approving all pending businesses:', error);
      message.error('Error approving all pending businesses');
    }
  };

  const approveAllPendingFranchises = async () => {
    try {
      const updatePromises = pendingFranchises.map(franchise => axios.put(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/franchises/${franchise.uuid}`, { status: 'approved' }));
      await Promise.all(updatePromises);
      message.success('All pending franchises approved successfully');
      fetchPendingFranchises();
    } catch (error) {
      console.error('Error approving all pending franchises:', error);
      message.error('Error approving all pending franchises');
    }
  };

  const saveAdminMessage = async (msg) => {
    try {
      await axios.post('https://seeknook-backend-2564a672bd98.herokuapp.com/api/messages/admin-message', { message: msg });
      message.success('Admin message saved successfully.');
      setMessageModalVisible(false);
    } catch (error) {
      console.error('Error saving admin message:', error);
      message.error('Failed to save admin message.');
    }
  };

  const deleteAdminMessage = async () => {
    try {
      await axios.delete('https://seeknook-backend-2564a672bd98.herokuapp.com/api/messages/admin-message');
      setAdminMessage('');
      message.success('Admin message deleted successfully.');
      setMessageModalVisible(false);
    } catch (error) {
      console.error('Error deleting admin message:', error);
      message.error('Failed to delete admin message.');
    }
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    return phone;
  };

  const renderBusinessTag = (business) => {
    if (business.sponsorStatus) {
      const color = business.sponsorStatus === 'gold' ? 'gold' : 'bronze';
      const bgColor = business.sponsorStatus === 'gold' ? '#ffd700' : '#cd7f32';
      const textColor = business.sponsorStatus === 'gold' ? 'black' : 'white';
      return (
        <Tag
          color={color}
          style={{
            fontWeight: 'bold',
            backgroundColor: bgColor,
            color: textColor,
            borderRadius: '5px',
            fontSize: '12px',
            padding: '2px 8px'
          }}
        >
          <CheckCircleOutlined /> {business.sponsorStatus.charAt(0).toUpperCase() + business.sponsorStatus.slice(1)}
        </Tag>
      );
    }
    return null;
  };

  const pendingColumns = [
    {
      title: 'Business',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => setSelectedBusiness(record)}>
          {text}
        </a>
      )
    },
    {
      title: 'Paid Status',
      dataIndex: 'paid',
      key: 'paid',
      render: (paid) => (paid ? 'True' : 'False')
    },
    {
      title: 'Payment ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
      render: (paymentId) => (paymentId ? paymentId : 'N/A')
    },
    {
      title: 'Sponsor Status',
      dataIndex: 'paymentPreferences',
      key: 'paymentPreferences',
      filters: [
        { text: 'Gold', value: 'gold' },
        { text: 'Bronze', value: 'bronze' },
        { text: 'Normal', value: 'cash_check' },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => {
        let color;
        let text;
        switch (status) {
          case 'gold':
            color = '#ffd700';
            text = 'Gold';
            break;
          case 'bronze':
            color = '#cd7f32';
            text = 'Bronze';
            break;
          case 'cash_check':
            color = '#ddd';
            text = 'Basic';
            break;
          case 'basic':
            color = '#ddd';
            text = 'Basic';
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => updateBusinessStatus(record.uuid, 'approved')} style={{ marginRight: '10px' }}>
            Approve
          </Button>
          <Button danger onClick={() => updateBusinessStatus(record.uuid, 'denied')}>
            Deny
          </Button>
        </>
      ),
    }
  ];

  const pendingFranchiseColumns = [
    {
      title: 'Franchise',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => setSelectedFranchise(record)}>
          {text}
        </a>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => updateFranchiseStatus(record.uuid, 'approved')} style={{ marginRight: '10px' }}>
            Approve
          </Button>
          <Button danger onClick={() => updateFranchiseStatus(record.uuid, 'denied')}>
            Deny
          </Button>
        </>
      ),
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => formatPhoneNumber(text),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Zip Code',
      dataIndex: 'zipcode',
      key: 'zipcode',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Denied', value: 'denied' },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => {
        let color;
        let text;
        switch (status) {
          case 'approved':
            color = 'green';
            text = 'Approved';
            break;
          case 'pending':
            color = 'yellow';
            text = 'Pending';
            break;
          case 'denied':
            color = 'red';
            text = 'Denied';
            break;
          default:
            color = 'gray';
            text = 'Unknown';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this business?"
          onConfirm={() => deleteBusiness(record.uuid)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="primary" icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const franchiseColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => formatPhoneNumber(text),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Zip Code',
      dataIndex: 'zipcode',
      key: 'zipcode',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Denied', value: 'denied' },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => {
        let color;
        let text;
        switch (status) {
          case 'approved':
            color = 'green';
            text = 'Approved';
            break;
          case 'pending':
            color = 'yellow';
            text = 'Pending';
            break;
          case 'denied':
            color = 'red';
            text = 'Denied';
            break;
          default:
            color = 'gray';
            text = 'Unknown';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this franchise?"
          onConfirm={() => deleteFranchise(record.uuid)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="primary" icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Data for the charts
  const cityData = businesses.reduce((acc, business) => {
    const city = business.city || 'Unknown';
    const zipcode = business.zipcode || 'Unknown';
    const cityWithZip = `${city} (${zipcode})`;
    if (!acc[cityWithZip]) acc[cityWithZip] = 0;
    acc[cityWithZip] += 1;
    return acc;
  }, {});

  const cityChartData = [['City', 'Count'], ...Object.entries(cityData).map(([cityWithZip, count]) => [`${cityWithZip} [${count}]`, count])];

  const zipCodeData = businesses.reduce((acc, business) => {
    const zipcode = business.zipcode || 'Unknown';
    if (!acc[zipcode]) acc[zipcode] = 0;
    acc[zipcode] += 1;
    return acc;
  }, {});

  const zipCodeChartData = [['Zip Code', 'Count'], ...Object.entries(zipCodeData).map(([zipcode, count]) => [zipcode, count])];

  const sponsorTypeData = businesses.reduce((acc, business) => {
    const sponsor = business.paymentPreferences || 'None';
    if (!acc[sponsor]) acc[sponsor] = 0;
    acc[sponsor] += 1;
    return acc;
  }, {});

  const sponsorTypeChartData = ([['Sponsor Type', 'Count'], ...Object.entries(sponsorTypeData).map(([sponsor, count]) => [`${sponsor} [${count}]`, count])]);

  const serviceData = businesses.reduce((acc, business) => {
    const services = business.serviceType || ['Unknown'];
    services.forEach((service) => {
      if (!acc[service]) acc[service] = 0;
      acc[service] += 1;
    });
    return acc;
  }, {});

  const serviceChartData = [['Service', 'Count'], ...Object.entries(serviceData).map(([service, count]) => [`${service} [${count}]`, count])];

  const generateDateData = (businesses, unit) => {
    const dateData = businesses.reduce((acc, business) => {
      const createdAt = new Date(business.created_at) || new Date();
      let key;
      if (unit === 'daily') {
        key = createdAt.toISOString().split('T')[0];
      } else if (unit === 'weekly') {
        const week = new Date(createdAt.setDate(createdAt.getDate() - createdAt.getDay() + 1));
        key = week.toISOString().split('T')[0];
      } else if (unit === 'monthly') {
        key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
      }
      if (!acc[key]) acc[key] = 0;
      acc[key] += 1;
      return acc;
    }, {});
    return [['Date', 'Count'], ...Object.entries(dateData).map(([date, count]) => [date, count])];
  };

  const dateChartData = generateDateData(businesses, timeRange);

  const engagementData = businesses.map((business) => [
    business.name,
    business.likes || 0,
    business.favorites || 0,
  ]);

  const engagementChartData = [['Business', 'Likes', 'Favorites'], ...engagementData];

  // Chart data for business status
  const statusData = businesses.reduce((acc, business) => {
    const status = business.status || 'Unknown';
    if (!acc[status]) acc[status] = 0;
    acc[status] += 1;
    return acc;
  }, {});

  const statusChartData = [['Status', 'Count'], ...Object.entries(statusData).map(([status, count]) => [`${status} [${count}]`, count])];

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Panel</h1>
        <Button type="primary" onClick={() => setMessageModalVisible(true)} icon={<PlusOutlined />}>
          Write Admin Message
        </Button>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Business Approvals" key="1">
          <Row gutter={16} justify="center">
            <Col span={24}>
              <Button type="primary" onClick={approveAllPendingBusinesses} style={{ marginBottom: '20px' }}>
                Approve All
              </Button>
            </Col>
            <Col span={24}>
              <Table dataSource={pendingBusinesses} columns={pendingColumns} rowKey="uuid" pagination={{ position: ['bottomCenter'], pageSize: 10 }} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Businesses Table" key="2">
          <Table dataSource={businesses} columns={columns} rowKey="uuid" pagination={{ position: ['bottomCenter'], pageSize: 10 }} />
        </TabPane>
        <TabPane tab="Businesses Charts" key="5">
          <Radio.Group value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={{ marginBottom: 16 }}>
            <Radio.Button value="daily">Daily</Radio.Button>
            <Radio.Button value="weekly">Weekly</Radio.Button>
            <Radio.Button value="monthly">Monthly</Radio.Button>
          </Radio.Group>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card title="Businesses by City">
                <Chart
                  chartType="PieChart"
                  data={cityChartData}
                  width="100%"
                  height="300px"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card title="Sponsor Types">
                <Chart
                  chartType="PieChart"
                  data={sponsorTypeChartData}
                  width="100%"
                  height="300px"
                />
              </Card>
            </Col>
            <Col xs={24} sm={16}>
              <Card title="Top Services">
                <Chart
                  chartType="PieChart"
                  data={serviceChartData}
                  width="100%"
                  height="300px"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card title="Business Status">
                <Chart
                  chartType="PieChart"
                  data={statusChartData}
                  width="100%"
                  height="300px"
                />
              </Card>
            </Col>
            <Col xs={24} sm={24}>
              <Card title="New Businesses">
                <Chart
                  chartType="LineChart"
                  data={dateChartData}
                  width="100%"
                  height="300px"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Franchise Approvals" key="3">
          <Row gutter={16} justify="center">
            <Col span={24}>
              <Button type="primary" onClick={approveAllPendingFranchises} style={{ marginBottom: '20px' }}>
                Approve All
              </Button>
            </Col>
            <Col span={24}>
              <Table dataSource={pendingFranchises} columns={pendingFranchiseColumns} rowKey="uuid" pagination={{ position: ['bottomCenter'], pageSize: 10 }} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Franchises Table" key="4">
          <Table dataSource={franchises} columns={franchiseColumns} rowKey="uuid" pagination={{ position: ['bottomCenter'], pageSize: 10 }} />
        </TabPane>
      </Tabs>

      <Modal
        title="Edit Admin Message"
        visible={messageModalVisible}
        onCancel={() => setMessageModalVisible(false)}
        footer={null}
        width="80%"
      >
        <Form onFinish={({ msg }) => saveAdminMessage(msg)} initialValues={{ msg: adminMessage }}>
          <Form.Item name="msg" rules={[{ required: true, message: 'Please enter a message' }]}>
            <Input.TextArea rows={8} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Message
            </Button>
            {adminMessage && (
              <Popconfirm
                title="Are you sure you want to delete the admin message?"
                onConfirm={deleteAdminMessage}
                okText="Yes"
                cancelText="No"
              >
                <Button danger type="primary" style={{ marginLeft: '10px' }}>
                  Delete Message
                </Button>
              </Popconfirm>
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={!!selectedBusiness}
        onCancel={() => setSelectedBusiness(null)}
        footer={[
          <Button key="approve" type="primary" onClick={() => { updateBusinessStatus(selectedBusiness.uuid, 'approved'); setSelectedBusiness(null); }}>
            Approve
          </Button>,
          <Button key="deny" danger onClick={() => { updateBusinessStatus(selectedBusiness.uuid, 'denied'); setSelectedBusiness(null); }}>
            Deny
          </Button>
        ]}
        centered
        width={window.innerWidth <= 768 ? '100%' : '50%'}
      >
        {selectedBusiness && <BusinessCard business={selectedBusiness} />}
      </Modal>

      <Modal
        visible={!!selectedFranchise}
        onCancel={() => setSelectedFranchise(null)}
        footer={[
          <Button key="approve" type="primary" onClick={() => { updateFranchiseStatus(selectedFranchise.uuid, 'approved'); setSelectedFranchise(null); }}>
            Approve
          </Button>,
          <Button key="deny" danger onClick={() => { updateFranchiseStatus(selectedFranchise.uuid, 'denied'); setSelectedFranchise(null); }}>
            Deny
          </Button>
        ]}
        centered
        width={window.innerWidth <= 768 ? '100%' : '50%'}
      >
        {selectedFranchise && <FranchiseCard franchise={selectedFranchise} />}
      </Modal>
    </div>
  );
};

export default AdminPanel;
