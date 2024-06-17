import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Form, Input, Button, message, Checkbox } from 'antd';

const EditListing = () => {
  const { type, id } = useParams();
  const [listing, setListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docRef = doc(db, type, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing(docSnap.data());
        } else {
          message.error('Listing not found');
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        message.error('Failed to fetch listing');
      }
    };

    fetchListing();
  }, [type, id]);

  const onFinish = async (values) => {
    try {
      const docRef = doc(db, type, id);
      await updateDoc(docRef, values);
      message.success('Listing updated successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating listing:', error);
      message.error('Failed to update listing');
    }
  };

  if (!listing) {
    return null;
  }

  return (
    <Form
      initialValues={listing}
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="phone" label="Phone">
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input />
      </Form.Item>
      <Form.Item name="website" label="Website">
        <Input />
      </Form.Item>
      <Form.Item name="zipcode" label="Zip Code">
        <Input />
      </Form.Item>
      <Form.Item name="displayPreferences" label="Display Preferences">
        <Checkbox.Group options={[
          { label: 'Phone', value: 'phone' },
          { label: 'Email', value: 'email' },
          { label: 'Military Discount', value: 'militaryDiscount' },
          { label: 'Group Discount', value: 'groupDiscount' },
          { label: 'Licensed & Insured', value: 'licensedInsured' },
          { label: 'Chesterfield', value: 'chesterfield' },
        ]} />
      </Form.Item>
      <Form.Item name="serviceType" label="Service Type">
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

export default EditListing;
