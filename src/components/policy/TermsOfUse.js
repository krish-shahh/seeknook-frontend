import React from 'react';
import { Layout, Typography } from 'antd';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const TermsOfUse = () => {
  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <Typography>
          <Title>SeekNook Terms of Use</Title>
          <Paragraph>Last Updated: 05/31/2024</Paragraph>
          <Paragraph>
            Welcome to SeekNook! By accessing or using the SeekNook platform (the "Platform"), you agree to comply with and be bound by these Terms of Use (the "Terms"). Please read them carefully. If you do not agree to these Terms, you may not use the Platform.
          </Paragraph>
          <Title level={2}>1. Acceptance of Terms</Title>
          <Paragraph>
            By registering for an account or using the Platform, you agree to abide by these Terms and any other policies referenced herein.
          </Paragraph>
          <Title level={2}>2. Services</Title>
          <Paragraph>
            SeekNook is an online platform that connects community members with local service providers. Services offered on the Platform include, but are not limited to, tutoring, handyman services, homemade food, and dog walking.
          </Paragraph>
          <Title level={2}>3. User Accounts</Title>
          <Paragraph>
            <ul>
              <li>Registration: To access certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.</li>
              <li>Account Security: You are responsible for maintaining the confidentiality of your account credentials and are fully responsible for all activities that occur under your account.</li>
              <li>Account Termination: SeekNook reserves the right to suspend or terminate your account if you violate these Terms or engage in any activities that harm the integrity or reputation of the Platform.</li>
            </ul>
          </Paragraph>
          <Title level={2}>4. User Conduct</Title>
          <Paragraph>
            <ul>
              <li>Prohibited Activities: You agree not to use the Platform for any unlawful or prohibited activities, including but not limited to:
                <ul>
                  <li>Posting false, misleading, or fraudulent content.</li>
                  <li>Harassing, threatening, or defaming other users.</li>
                  <li>Violating intellectual property rights.</li>
                  <li>Distributing spam or malware.</li>
                </ul>
              </li>
              <li>Content Standards: All content you post on the Platform must be accurate, legal, and respectful.</li>
            </ul>
          </Paragraph>
          <Title level={2}>5. Service Providers</Title>
          <Paragraph>
            <ul>
              <li>Verification: SeekNook may, but is not obligated to, conduct background checks or other verification processes on service providers.</li>
              <li>Responsibility: Service providers are independent contractors and not employees of SeekNook. SeekNook is not responsible for the actions or omissions of any service provider.</li>
            </ul>
          </Paragraph>
          <Title level={2}>6. Payments</Title>
          <Paragraph>
            <ul>
              <li>Payment Terms: Users agree to pay for services received through the Platform in accordance with the agreed-upon terms.</li>
              <li>Refunds: Refund policies vary by service provider. SeekNook is not responsible for refund disputes between users and service providers.</li>
            </ul>
          </Paragraph>
          <Title level={2}>7. Privacy</Title>
          <Paragraph>
            <ul>
              <li>Data Collection: SeekNook collects and uses your personal information in accordance with its Privacy Policy.</li>
              <li>Data Security: While SeekNook takes reasonable measures to protect your information, it cannot guarantee absolute security.</li>
            </ul>
          </Paragraph>
          <Title level={2}>8. Intellectual Property</Title>
          <Paragraph>
            <ul>
              <li>Ownership: SeekNook and its licensors retain all rights, title, and interest in the Platform and its content.</li>
              <li>License: SeekNook grants you a limited, non-exclusive, non-transferable, and revocable license to use the Platform in accordance with these Terms.</li>
            </ul>
          </Paragraph>
          <Title level={2}>9. Disclaimers</Title>
          <Paragraph>
            <ul>
              <li>No Warranty: The Platform is provided "as is" and "as available" without any warranties of any kind, either express or implied.</li>
              <li>Limitation of Liability: SeekNook shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform.</li>
            </ul>
          </Paragraph>
          <Title level={2}>10. Indemnification</Title>
          <Paragraph>
            You agree to indemnify, defend, and hold harmless SeekNook, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the Platform or violation of these Terms.
          </Paragraph>
          <Title level={2}>11. Changes to Terms</Title>
          <Paragraph>
            SeekNook reserves the right to modify these Terms at any time. Any changes will be effective immediately upon posting on the Platform. Your continued use of the Platform after any such changes constitutes your acceptance of the new Terms.
          </Paragraph>
          <Title level={2}>12. Governing Law</Title>
          <Paragraph>
            These Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of laws principles.
          </Paragraph>
          <Title level={2}>13. Contact Information</Title>
          <Paragraph>
            If you have any questions about these Terms, please contact us at [support@seeknook.com].
          </Paragraph>
          <Paragraph>
            By using SeekNook, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
          </Paragraph>
        </Typography>
      </Content>
    </Layout>
  );
};

export default TermsOfUse;
