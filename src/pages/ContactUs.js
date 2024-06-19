import React, { useState } from 'react';
import { Form, Input, Button, Select, Radio, TimePicker, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const ContactUs = () => {
  const [form] = Form.useForm();
  const [preferredContactMethod, setPreferredContactMethod] = useState('Email');

  const onFinish = async (values) => {
    // Format the bestTimeToReach to a readable format if it exists
    if (values.bestTimeToReach) {
      values.bestTimeToReach = values.bestTimeToReach.map(time => time.format('h:mm a')).join(' - ');
    }

    try {
      const response = await axios.post('https://formspree.io/f/xwpeeell', values); // Replace with your Formspree form ID
      if (response.status === 200) {
        message.success('Your message has been sent successfully!');
        form.resetFields();
      }
    } catch (error) {
      message.error('Failed to send your message. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Contact Us</h2>
      <p>We'd love to hear from you! Please fill out the form below, and we'll get back to you as soon as possible.</p>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your full name.' }]}
        >
          <Input placeholder="Please enter your full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter a valid email address.', type: 'email' },
          ]}
        >
          <Input placeholder="Please enter a valid email address" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number (Optional)"
        >
          <Input placeholder="Please enter your phone number" />
        </Form.Item>

        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: 'Please select a subject for your inquiry.' }]}
        >
          <Select placeholder="Please select a subject for your inquiry">
            <Option value="General Inquiry">General Inquiry</Option>
            <Option value="Payment Inquiry">Payment Inquiry</Option>
            <Option value="Technical Support">Technical Support</Option>
            <Option value="Feedback">Feedback</Option>
            <Option value="Partnership/Referral Opportunities">Partnership/Referral Opportunities</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="message"
          label="Message"
          rules={[{ required: true, message: 'Please describe your inquiry or feedback.' }]}
        >
          <TextArea placeholder="Please describe your inquiry or feedback" maxLength={1000} rows={6} />
        </Form.Item>

        <Form.Item
          name="preferredContactMethod"
          label="Preferred Contact Method"
          initialValue={preferredContactMethod}
        >
          <Radio.Group onChange={(e) => setPreferredContactMethod(e.target.value)}>
            <Radio value="Email">Email</Radio>
            <Radio value="Phone">Phone</Radio>
          </Radio.Group>
        </Form.Item>

        {preferredContactMethod === 'Phone' && (
          <Form.Item
            name="bestTimeToReach"
            label="Best Time to Reach You (Optional)"
          >
            <TimePicker.RangePicker use12Hours format="h:mm a" />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ContactUs;
