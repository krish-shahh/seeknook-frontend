import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Checkbox, Button, Select, Tooltip, Row, Col, message, Modal } from 'antd';
import { auth } from '../firebase-config';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import SquarePaymentFormComponent from './SquarePaymentFormComponent';

const { TextArea } = Input;
const { Option } = Select;

const CreateFranchiseOpportunity = ({ initialValues, onCancel, onSuccess, onSave }) => {
  const [form] = Form.useForm();
  const [serviceOptions, setServiceOptions] = useState([]);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [titleLength, setTitleLength] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); // Default payment method
  const [paid, setPaid] = useState(false);
  const isEditing = initialValues !== null;
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const paymentFormRef = useRef(null);
  const [listingData, setListingData] = useState({});

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
        setUid(user.uid);
        form.setFieldsValue({ email: user.email, uid: user.uid });
        fetchServiceTypes();
      }
    });
  }, [form]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setDescriptionLength(initialValues.description?.length || 0);
      setTitleLength(initialValues.name?.length || 0);
    } else {
      form.resetFields();
      form.setFieldsValue({ email, uid });
      setDescriptionLength(0);
      setTitleLength(0);
    }
  }, [initialValues, form, email, uid]);

  const fetchServiceTypes = async () => {
    try {
      const response = await axios.get('https://seeknook-backend-2564a672bd98.herokuapp.com/api/services');
      setServiceOptions(response.data);
    } catch (error) {
      console.error('Error fetching services from backend:', error);
    }
  };

  const onFinish = async (values) => {
    if (isEditing) {
      const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      try {
        await axios.put(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/franchises/${initialValues.uuid}`, {
          ...filteredValues,
          status: 'pending',
        });
        onSave(filteredValues);
      } catch (error) {
        console.error('Error updating listing:', error);
        message.error('Failed to update listing. Please try again.');
      }
    } else {
      const formValues = form.getFieldsValue();
      setListingData(formValues);
      setIsPaymentModalVisible(true);
    }
  };

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    switch (plan) {
      case 'basic':
        setPaymentAmount(75000); // $750 in cents
        break;
      case 'bronze':
        setPaymentAmount(150000); // $1500 in cents
        break;
      case 'gold':
        setPaymentAmount(250000); // $2500 in cents
        break;
      default:
        setPaymentAmount(0);
        break;
    }
  };

  const handlePaymentMethodSelection = (method) => {
    setPaymentMethod(method);
    setPaid(method === 'card');
  };

  const handlePaymentSuccess = async (nonce) => {
    try {
      const response = await axios.post('https://seeknook-backend-2564a672bd98.herokuapp.com/api/payment/create-payment', {
        amount: paymentAmount,
        currency: 'USD',
        sourceId: nonce,
        email: email,
      });

      if (response.status === 200) {
        message.success('Payment successful!');
        setIsPaymentModalVisible(false);
        submitListing({ ...listingData, payment_preferences: selectedPlan, payment_id: response.data.paymentId, paid: true });
      } else {
        message.error('Payment failed. Please try again.');
      }
    } catch (error) {
      message.error(`Payment failed: ${error.message}`);
    }
  };

  const submitListing = async () => {
    const values = listingData;
    const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    try {
      const payload = {
        ...filteredValues,
        created_at: new Date().toISOString(),
        status: 'pending',
        useruid: auth.currentUser.uid,
        likes: 0,
        payment_preferences: [selectedPlan], // Keep payment_preferences as a string
        paid: paid, // Set paid based on payment method
      };

      console.log('Payload:', payload); // Log the payload to verify values

      await axios.post('https://seeknook-backend-2564a672bd98.herokuapp.com/api/franchises', payload);
      form.resetFields();
      form.setFieldsValue({ email, uid });
      onSuccess('Franchise Listing');
      setIsPaymentModalVisible(false);
    } catch (error) {
      console.error('Error adding document: ', error);
      message.error('Failed to submit listing. Please try again.');
    }
  };

  const onDescriptionChange = (e) => {
    setDescriptionLength(e.target.value.length);
    form.setFieldsValue({ description: e.target.value });
  };

  const onTitleChange = (e) => {
    setTitleLength(e.target.value.length);
    form.setFieldsValue({ name: e.target.value });
  };

  const onFieldsChange = (_, allFields) => {
    const allValid = allFields.every(field => field.errors.length === 0);
    setIsFormValid(allValid);
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish} onFieldsChange={onFieldsChange}>
        <Form.Item name="name" label="Name/Posting Title" rules={[{ required: true, message: 'Please input your posting title!', max: 100 }]}>
          <Input placeholder="Enter your posting title" maxLength={100} onChange={onTitleChange} disabled={isEditing} value={form.getFieldValue('name')}/>
          <div style={{ marginTop: '10px' }}>{titleLength}/100 characters</div>
        </Form.Item>

        <Form.Item name="service_type" label="Type of Service/Sector/Product/Industry" rules={[{ required: true, message: 'Please select a type!' }]}>
          <Select mode="multiple" placeholder="Select type">
            {serviceOptions.map((service, index) => (
              <Option key={index} value={service}>{service}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="investment_amount" label="Total Required Investment" rules={[{ required: true, message: 'Please select an investment amount!' }]}>
          <Select placeholder="Select investment amount">
            <Option value="below_50k">Below 50K</Option>
            <Option value="below_100k">Below 100K</Option>
            <Option value="below_250k">Below 250K</Option>
            <Option value="below_350k">Below 350K</Option>
            <Option value="below_500k">Below 500K</Option>
            <Option value="below_750k">Below 750K</Option>
            <Option value="below_1m">Below 1M</Option>
            <Option value="over_1m">Over 1M</Option>
          </Select>
        </Form.Item>

        <Form.Item name="uid" label="User ID">
          <Input placeholder="Enter your uid" disabled />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'The input is not valid E-mail!' }]}>
          <Input placeholder="Enter your email" disabled />
        </Form.Item>

        <Form.Item
          name="phone"
          label={
            <span>
              Phone (Format: XXXXXXXXXX) &nbsp;
              <Tooltip title="International users, please enter '9999999999'">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input placeholder="Enter your phone number" maxLength={10} minLength={10} />
        </Form.Item>

        <Form.Item
          name="zipcode"
          label={
            <span>
              Zipcode (Format: XXXXX) &nbsp;
              <Tooltip title="International users, please enter '00000'">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: 'Please input your zipcode!' }]}
        >
          <Input placeholder="Enter your zipcode" maxLength={5} minLength={5} />
        </Form.Item>

        <Form.Item name="website" label="Website (Optional)">
          <Input placeholder="http://yourwebsite.com" />
        </Form.Item>

        <Form.Item
          name="instagram"
          label={
            <>
              Instagram Username (Optional)&nbsp;
              <Tooltip title="Example: username part from https://instagram.com/username">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            </>
          }
        >
          <Input placeholder="Instagram username" />
        </Form.Item>

        <Form.Item
          name="facebook"
          label={
            <>
              Facebook Username (Optional)&nbsp;
              <Tooltip title="Example: username part from https://facebook.com/username">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            </>
          }
        >
          <Input placeholder="Facebook username" />
        </Form.Item>

        <Form.Item
          name="whatsapp"
          label="WhatsApp Group Link (Optional)"
          rules={[
            {
              validator: (_, value) =>
                value && !value.startsWith('https://chat.whatsapp.com/')
                  ? Promise.reject(new Error('Invalid WhatsApp Group Link! It should start with https://chat.whatsapp.com/'))
                  : Promise.resolve(),
            },
          ]}
        >
          <Input placeholder="https://chat.whatsapp.com/your-group-link" />
        </Form.Item>

        <Form.Item name="description" label={<span>Description&nbsp;<Tooltip title="Include all required information such as Franchising Fee, Investment Range, Royalty, Minimum Liquid Assets, Minimum Net Worth, etc."><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip></span>} rules={[{ required: true, message: 'Please input your description including franchising fee, investment range, etc.' }]}>
          <TextArea rows={4} maxLength={1500} placeholder="Enter your description" onChange={onDescriptionChange} value={form.getFieldValue('description')}/>
          <div style={{ marginTop: '10px' }}>{descriptionLength}/1500 characters</div>
        </Form.Item>

        <Form.Item name="display_preferences" label="Display Preferences" rules={[{ required: true }]}>
          <Checkbox.Group style={{ width: '100%', border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8}><Checkbox value="email">Email</Checkbox></Col>
              <Col xs={24} sm={12} md={8}><Checkbox value="phone">Phone</Checkbox></Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item name="referred_by" label="Referred By">
          <Input placeholder="Jon Doe" maxLength={30} />
        </Form.Item>

        <Row justify="center">
          <Col>
            <Button type="primary" htmlType="submit" disabled={!isFormValid}>
              {isEditing ? 'Update Listing' : 'Submit Listing'}
            </Button>
            <Button type="default" onClick={onCancel} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>

      {!isEditing && (
        <Modal
          title="Choose Your Plan"
          visible={isPaymentModalVisible}
          onCancel={() => setIsPaymentModalVisible(false)}
          footer={null}
        >
          <Form.Item name="plan" label="Plan" rules={[{ required: true, message: 'Please select a plan!' }]}>
            <Select placeholder="Select Plan" onChange={handlePlanSelection} style={{ width: '100%', marginBottom: '20px' }}>
              <Option value="basic">Basic ($750/year)</Option>
              <Option value="bronze">Bronze ($1500/year)</Option>
              <Option value="gold">Gold ($2500/year)</Option>
            </Select>
          </Form.Item>
          <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true, message: 'Please select a payment method!' }]}>
            <Select placeholder="Select Payment Method" onChange={handlePaymentMethodSelection} style={{ width: '100%', marginBottom: '20px' }}>
              <Option value="card">Card Payment</Option>
              <Option value="cash">Cash Payment</Option>
              <Option value="check">Check Payment</Option>
            </Select>
          </Form.Item>
          {paymentMethod === 'card' ? (
            <SquarePaymentFormComponent
              ref={paymentFormRef}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={(error) => message.error(`Payment failed: ${error.message}`)}
            />
          ) : (
            <div>
              <Button type="primary" onClick={submitListing}>Submit Listing</Button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default CreateFranchiseOpportunity;
