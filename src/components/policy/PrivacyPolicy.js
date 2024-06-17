import React from 'react';
import { Layout, Typography } from 'antd';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const PrivacyPolicy = () => {
  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <Typography>
          <Title>SeekNook Privacy Policy</Title>
          <Paragraph>Effective Date: 5/31/2024</Paragraph>
          <Title level={2}>1. Introduction</Title>
          <Paragraph>
            Welcome to SeekNook ("Platform"). This Privacy Policy describes how we collect, use, and disclose personal information when you use our Platform. By accessing or using the Platform, you agree to the terms of this Privacy Policy.
          </Paragraph>
          <Title level={2}>2. Information We Collect</Title>
          <Paragraph>
            When you create a business listing on SeekNook, we collect the following information:
            <ul>
              <li>Name/Posting Title (0/100 characters)</li>
              <li>Type of Service</li>
              <li>Email</li>
              <li>Phone</li>
              <li>Zip Code</li>
              <li>City</li>
              <li>Website (Optional)</li>
              <li>Instagram Username (Optional)</li>
              <li>Facebook Username (Optional)</li>
              <li>WhatsApp Group Link (Optional)</li>
              <li>Description (0/1000 characters)</li>
              <li>Display Preferences</li>
              <li>Service Area (Residential/Commercial)</li>
              <li>Delivery Options</li>
              <li>Payment Preferences</li>
              <li>Referred By</li>
            </ul>
          </Paragraph>
          <Paragraph>
            When you create a franchise listing on SeekNook, we collect the following information:
            <ul>
              <li>Name/Posting Title (0/100 characters)</li>
              <li>Type of Sector</li>
              <li>Email</li>
              <li>Phone</li>
              <li>Zip Code</li>
              <li>Website (Optional)</li>
              <li>Instagram Username (Optional)</li>
              <li>Facebook Username (Optional)</li>
              <li>WhatsApp Group Link (Optional)</li>
              <li>Description (0/1500 characters)</li>
              <li>Display Preferences</li>
              <li>Payment Preferences</li>
              <li>Referred By</li>
            </ul>
          </Paragraph>
          <Title level={2}>3. How We Use Your Information</Title>
          <Paragraph>
            We use the information we collect for the following purposes:
            <ul>
              <li>To provide and maintain the Platform.</li>
              <li>To create and manage your business or franchise listings.</li>
              <li>To communicate with you about your listings, account, or Platform updates.</li>
              <li>To improve our services and develop new features.</li>
              <li>To analyze usage trends and preferences.</li>
              <li>To prevent fraud and ensure the security of our Platform.</li>
            </ul>
          </Paragraph>
          <Title level={2}>4. How We Share Your Information</Title>
          <Paragraph>
            We may share your information with third parties for the following purposes:
            <ul>
              <li>With service providers who help us operate the Platform and provide related services.</li>
              <li>With third parties for marketing or advertising purposes, with your consent.</li>
              <li>With law enforcement agencies or other third parties when required by law or to protect our legal rights.</li>
            </ul>
          </Paragraph>
          <Title level={2}>5. Your Choices</Title>
          <Paragraph>
            You can choose not to provide certain information, but this may limit your ability to use certain features of the Platform. You can also opt-out of receiving marketing communications from us by following the instructions provided in such communications.
          </Paragraph>
          <Title level={2}>6. Data Security</Title>
          <Paragraph>
            We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is completely secure, so we cannot guarantee absolute security.
          </Paragraph>
          <Title level={2}>7. Data Retention</Title>
          <Paragraph>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </Paragraph>
          <Title level={2}>8. Children's Privacy</Title>
          <Paragraph>
            The Platform is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. If you believe that we may have collected personal information from a child under 13, please contact us immediately.
          </Paragraph>
          <Title level={2}>9. Changes to this Privacy Policy</Title>
          <Paragraph>
            We may update this Privacy Policy from time to time by posting the revised version on this page. We will notify you of any material changes by email or through the Platform. Your continued use of the Platform after the effective date of the revised Privacy Policy constitutes your acceptance of the changes.
          </Paragraph>
          <Title level={2}>10. Contact Us</Title>
          <Paragraph>
            If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at [contact information].
          </Paragraph>
          <Paragraph>
            By using SeekNook, you acknowledge that you have read, understood, and agree to the terms of this Privacy Policy. Thank you for using our Platform!
          </Paragraph>
        </Typography>
      </Content>
    </Layout>
  );
};

export default PrivacyPolicy;
