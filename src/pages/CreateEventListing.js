import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Checkbox, Button, Select, Typography, Card, Row, Col, DatePicker } from 'antd';
import { db, auth } from '../firebase-config';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

function CreateEventListing() {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (!user) {
                alert("You must be signed in to create an event listing");
                navigate("/login");
            } else {
                form.setFieldsValue({
                    email: user.email // Auto-fill the email and make it non-editable
                });
            }
        });
    }, [form, navigate]);

    const onFinish = async (values) => {
      if (isSubmitting) return;  // Prevent multiple submissions
      setIsSubmitting(true);

      const startDate = values.startDate ? values.startDate.valueOf() : null;
      const endDate = values.endDate ? values.endDate.valueOf() : null;

      // Process the form values, ensuring empty strings for optional fields are handled
      const filteredValues = {
          ...values,
          startDate, // Converted startDate to Unix timestamp
          endDate,   // Converted endDate to Unix timestamp
          website: values.website ? values.website : "", // Ensure empty string if undefined
          created_at: Timestamp.now() // Use Firebase server timestamp for creation time
      };

      try {
          const docRef = await addDoc(collection(db, "events"), filteredValues);
          alert("Event Listing Submitted Successfully!");
          navigate("/dashboard");
      } catch (e) {
          console.error("Error adding document: ", e);
          alert("Error submitting listing: " + e.message);
      }
      setIsSubmitting(false);
  };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'white' }}>
            <Card bordered={false} style={{ width: '80%', maxWidth: '70%', marginTop: 0 }}>
                <Title level={2}>Create Event Listing</Title>
                <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                name="eventName"
                                label="Event Name"
                                rules={[{ required: true, message: 'Please enter the name of the event!' }]}
                            >
                                <Input placeholder="Enter the name of the event" />
                            </Form.Item>

                            <Form.Item name="typeOfEvent" label="Type of Event" rules={[{ required: true, message: 'Please select the type of event!' }]}>
                                <Select mode="multiple" placeholder="Select event type">
                                    {/* Options for event types */}
                                    <Option value="concerts">Concerts Live Music Artist</Option>
                                    <Option value="shows">Shows Comedy Stand-up Fashion</Option>
                                    <Option value="local_events">Local & Community Events</Option>
                                    <Option value="childrens_event">Children's Event</Option>
                                    <Option value="festivals">Festivals Harvest Diwali Holi Ganesha</Option>
                                    <Option value="indian_community_events">Indian Community Events</Option>
                                    <Option value="parties">Parties Bollywood Diwali</Option>
                                    <Option value="dance_drama">Dance & Drama</Option>
                                    <Option value="charity_nonprofit">Charity & Nonprofit</Option>
                                    <Option value="exhibits_fairs">Exhibits Fairs Arts Crafts</Option>
                                    <Option value="food_festival">Food Festival</Option>
                                    <Option value="farmers_market">Farmers Market</Option>
                                    <Option value="art_show">Art Show</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="startDate"
                                label="Start Date and Time"
                                rules={[{ required: true, message: 'Please select the start date and time!' }]}
                            >
                                <DatePicker 
                                    showTime={{ format: 'HH:mm' }} // 24-hour format
                                    format="YYYY-MM-DD HH:mm" 
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="endDate"
                                label="End Date and Time"
                                rules={[{ required: true, message: 'Please select the end date and time!' }]}
                            >
                                <DatePicker 
                                    showTime={{ format: 'HH:mm' }} // 24-hour format
                                    format="YYYY-MM-DD HH:mm" 
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item name="email" label="Email Address">
                                <Input placeholder="Enter your email" disabled />
                            </Form.Item>

                            <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please input your phone number!' }]}>
                                <Input placeholder="Enter your phone number" />
                            </Form.Item>

                            <Form.Item name="zipcode" label="Zipcode" rules={[{ required: true, message: 'Please input your zipcode!' }]}>
                                <Input placeholder="Enter your zipcode" />
                            </Form.Item>

                            <Form.Item name="website" label="Website (Optional)">
                                <Input placeholder="http://yourwebsite.com" />
                            </Form.Item>

                            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
                                <TextArea rows={4} placeholder="Enter your description" />
                            </Form.Item>

                            <Form.Item name="displayPreferences" label="Display Preferences" rules={[{ required: true, message: 'Please select your preferences!' }]}>
                                <Checkbox.Group style={{ width: '100%' }}>
                                    <Checkbox value="email">Email</Checkbox>
                                    <Checkbox value="phone">Phone</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>

                            <Form.Item name="paymentPreferences" label="Payment Preferences" rules={[{ required: true, message: 'Please select your payment preference!' }]}>
                                <Checkbox.Group style={{ width: '100%' }}>
                                    <Checkbox value="cash_check">I will pay via Cash/Check</Checkbox>
                                    <Checkbox value="paypal_zelle">I will pay via PayPal/Zelle</Checkbox>
                                    <Checkbox value="sponsor">I am interested in becoming a sponsor</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>

                            <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                                Submit Listing
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}

export default CreateEventListing;
