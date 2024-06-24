import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Checkbox, Button, Select, Tooltip, Row, Col, message, Modal, Card } from 'antd';
import { auth } from '../firebase-config';
import { InfoCircleOutlined } from '@ant-design/icons';
import loadZipCodeData from '../components/loadZipCodeData';
import axios from 'axios';
import SquarePaymentFormComponent from './SquarePaymentFormComponent';
import './CreateBusinessListing.css'; // Import the CSS file

const { TextArea } = Input;
const { Option } = Select;

const CreateBusinessListing = ({ initialValues, onCancel, onSuccess, onSave }) => {
  const [form] = Form.useForm();
  const [serviceOptions, setServiceOptions] = useState([]);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [titleLength, setTitleLength] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');
  const [zipCodeDetails, setZipCodeDetails] = useState({});
  const [zipCodeData, setZipCodeData] = useState({});
  const [serviceAreaOptions, setServiceAreaOptions] = useState([]);
  const [listingData, setListingData] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const isEditing = initialValues !== null;
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const paymentFormRef = useRef(null);

  // Load zip code data
  useEffect(() => {
    const fetchZipCodeData = async () => {
      const data = await loadZipCodeData();
      setZipCodeData(data);
    };
    fetchZipCodeData();
  }, []);

  // Auth state change listener
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

  // Handle initial values
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setDescriptionLength(initialValues.description?.length || 0);
      setTitleLength(initialValues.name?.length || 0);

      if (initialValues.zipcode) {
        const details = zipCodeData[initialValues.zipcode];
        if (details) {
          form.setFieldsValue({ city: details.city, state_id: details.state_id });
          setZipCodeDetails(details);

          const state = details.state_id;
          const city = details.city;
          setServiceAreaOptions([
            { label: 'Do Not Display', value: 'do_not_display' },
            { label: `${city} Only`, value: `${city.toLowerCase()}_only` },
            { label: `Anywhere in ${state}`, value: `anywhere_${state.toLowerCase()}` },
            { label: `Central ${state}`, value: `central_${state.toLowerCase()}` },
            { label: `South ${state}`, value: `south_${state.toLowerCase()}` },
            { label: `North ${state}`, value: `north_${state.toLowerCase()}` },
            { label: 'Anywhere Remotely', value: 'anywhere_remotely' },
          ]);
        }
      }
    } else {
      form.resetFields();
      form.setFieldsValue({ email, uid });
      setDescriptionLength(0);
      setTitleLength(0);
    }
  }, [initialValues, form, email, uid, zipCodeData]);

  // Fetch service types
  const fetchServiceTypes = async () => {
    try {
      const response = await axios.get('https://seeknook-backend-2564a672bd98.herokuapp.com/api/services');
      setServiceOptions(response.data);
    } catch (error) {
      console.error('Error fetching services from backend:', error);
    }
  };

  // Handle form submission
  const onFinish = async (values) => {
    if (isEditing) {
      const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const additionalData = zipCodeDetails[filteredValues.zipcode];

      if (additionalData) {
        filteredValues.city = additionalData.city;
        filteredValues.state_id = additionalData.state_id;
        filteredValues.lat = additionalData.lat;
        filteredValues.lng = additionalData.lng;
        filteredValues.county_name = additionalData.county_name;
      }

      try {
        await axios.put(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/businesses/${initialValues.uuid}`, {
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

  // Handle plan selection
  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    switch (plan) {
      case 'basic':
        setPaymentAmount(25000); // $250 in cents
        break;
      case 'bronze':
        setPaymentAmount(50000); // $500 in cents
        break;
      case 'gold':
        setPaymentAmount(100000); // $1000 in cents
        break;
      default:
        setPaymentAmount(0);
        break;
    }
  };

  // Handle payment success
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
        submitListing({ ...listingData, payment_preferences: selectedPlan, payment_id: response.data.paymentId });
      } else {
        message.error('Payment failed. Please try again.');
      }
    } catch (error) {
      message.error(`Payment failed: ${error.message}`);
    }
  };

  // Submit listing to the backend
  const submitListing = async (values) => {
    const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const additionalData = zipCodeDetails[filteredValues.zipcode];

    if (additionalData) {
      filteredValues.city = additionalData.city;
      filteredValues.state_id = additionalData.state_id;
      filteredValues.lat = additionalData.lat;
      filteredValues.lng = additionalData.lng;
      filteredValues.county_name = additionalData.county_name;
    }

    try {
      await axios.post('https://seeknook-backend-2564a672bd98.herokuapp.com/api/businesses', {
        ...filteredValues,
        created_at: new Date().toISOString(),
        status: 'pending',
        useruid: auth.currentUser.uid,
        likes: 0,
      });
      form.resetFields();
      form.setFieldsValue({ email, uid });
      onSuccess('Business Listing');
    } catch (error) {
      console.error('Error adding document: ', error);
      message.error('Failed to submit listing. Please try again.');
    }
  };

  // Handle description change
  const onDescriptionChange = (e) => {
    setDescriptionLength(e.target.value.length);
    form.setFieldsValue({ description: e.target.value });
  };

  // Handle title change
  const onTitleChange = (e) => {
    setTitleLength(e.target.value.length);
    form.setFieldsValue({ name: e.target.value });
  };

  // Handle fields change
  const onFieldsChange = (_, allFields) => {
    const allValid = allFields.every(field => field.errors.length === 0);
    setIsFormValid(allValid);
  };

  // Handle zipcode change
  const onZipcodeChange = (e) => {
    const details = zipCodeData[e.target.value];
    if (details) {
      form.setFieldsValue({ city: details.city, state_id: details.state_id });
      setZipCodeDetails(details);

      const state = details.state_id;
      const city = details.city;
      setServiceAreaOptions([
        { label: 'Do Not Display', value: 'do_not_display' },
        { label: `${city} Only`, value: `${city.toLowerCase()}_only` },
        { label: `Anywhere in ${state}`, value: `anywhere_${state.toLowerCase()}` },
        { label: `Central ${state}`, value: `central_${state.toLowerCase()}` },
        { label: `South ${state}`, value: `south_${state.toLowerCase()}` },
        { label: `North ${state}`, value: `north_${state.toLowerCase()}` },
        { label: 'Anywhere Remotely', value: 'anywhere_remotely' },
      ]);
    } else {
      setServiceAreaOptions([]);
    }
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish} onFieldsChange={onFieldsChange}>
        <Form.Item name="name" label="Name/Posting Title" rules={[{ required: true, message: 'Please input your posting title!', max: 100 }]}>
          <Input placeholder="Enter your posting title" maxLength={100} onChange={onTitleChange} disabled={isEditing} value={form.getFieldValue('name')}/>
          <div style={{ marginTop: '10px' }}>{titleLength}/100 characters</div>
        </Form.Item>

        <Form.Item name="service_type" label="Type of Service" rules={[{ required: true, message: 'Please select a service type!' }]}>
          <Select mode="multiple" placeholder="Select services">
            {serviceOptions.map((service, index) => (
              <Option key={index} value={service}>{service}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="uid" label="User ID">
          <Input placeholder="Enter your uid" disabled />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'The input is not valid E-mail!' }]}>
          <Input placeholder="Enter your email" disabled />
        </Form.Item>

        <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please input your phone number!' }]}>
          <Input placeholder="Enter your phone number" maxLength={10} minLength={10} />
        </Form.Item>

        <Form.Item name="zipcode" label="Zipcode" rules={[{ required: true, message: 'Please input your zipcode!' }]}>
          <Input placeholder="Enter your zipcode" maxLength={5} minLength={5} onChange={onZipcodeChange} />
        </Form.Item>

        <Form.Item name="city" label="City">
          <Input placeholder="City" disabled />
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

        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input your description!', min: 1 }]}>
          <TextArea rows={4} placeholder="Enter your description" maxLength={1000} onChange={onDescriptionChange} value={form.getFieldValue('description')} />
          <div style={{ marginTop: '10px' }}>{descriptionLength}/1000 characters</div>
        </Form.Item>

        <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
          <Form.Item name="display_preferences" label="Display Preferences" rules={[{ required: true, message: 'Please select your preferences!' }]}>
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={6}><Checkbox value="email">Email</Checkbox></Col>
                <Col xs={24} sm={12} md={6}><Checkbox value="phone">Phone</Checkbox></Col>
                <Col xs={24} sm={12} md={6}><Checkbox value="city">Located in {zipCodeDetails.city || 'Chesterfield'}</Checkbox></Col>
                <Col xs={24} sm={12} md={6}><Checkbox value="groupDiscount">Offers Group Discount</Checkbox></Col>
                <Col xs={24} sm={12} md={6}><Checkbox value="licensedInsured">Licensed & Insured</Checkbox></Col>
                <Col xs={24} sm={12} md={6}><Checkbox value="militaryDiscount">Military/Veteran Owned</Checkbox></Col>
                <Col xs={24} sm={12} md={6}><Checkbox value="hiring">We are Hiring</Checkbox></Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="service_area" label="We Serve" rules={[{ required: true, message: 'Please select your service area(s)!' }]}>
            <Select placeholder="Select service area">
              {serviceAreaOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="business_type" label="">
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8}><Checkbox value="residential">Residential</Checkbox></Col>
                <Col xs={24} sm={12} md={8}><Checkbox value="commercial">Commercial</Checkbox></Col>
                <Col xs={24} sm={12} md={8}><Checkbox value="deliver">We Deliver</Checkbox></Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </div>

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
          footer={null} // Remove cancel and OK buttons
        >
          <Form.Item name="plan" label="Plan" rules={[{ required: true, message: 'Please select a plan!' }]}>
            <Select placeholder="Select Plan" onChange={handlePlanSelection} style={{ width: '100%', marginBottom: '20px' }}>
              <Option value="basic">Basic ($250/year)</Option>
              <Option value="bronze">Bronze ($500/year)</Option>
              <Option value="gold">Gold ($1000/year)</Option>
            </Select>
          </Form.Item>
          <SquarePaymentFormComponent
            ref={paymentFormRef}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={(error) => message.error(`Payment failed: ${error.message}`)}
          />
        </Modal>
      )}
    </>
  );
};

export default CreateBusinessListing;
