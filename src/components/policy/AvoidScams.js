import React from 'react';
import { Layout, Typography } from 'antd';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const AvoidScams = () => {
  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <Typography>
          <Title>SeekNook Avoid Scams Guideline & Protection Tips</Title>
          <Paragraph>
            At SeekNook, we are committed to providing a safe and trustworthy platform for our users. To help you avoid scams and fraudulent activities, please follow these guidelines and protection tips:
          </Paragraph>
          <Title level={2}>Protection Tips:</Title>
          <Paragraph>
            <ul>
              <li>
                <strong>Avoid paying up front:</strong> Avoid paying up front. Never make the final payment until you are completely satisfied with the service provided. Avoid cash payments whenever possible, as they offer less recourse in case of disputes.
              </li>
              <li>
                <strong>Get everything in writing:</strong> Make sure you and the service provider are on the same page by getting all project details in writing before signing a contract. Avoid verbal commitments, as they can lead to misunderstandings later.
              </li>
              <li>
                <strong>Get multiple estimates:</strong> Try to obtain at least three estimates from different providers and compare them carefully. Ensure that you are comparing "apples to apples" by considering factors such as materials, labor, and project scope.
              </li>
              <li>
                <strong>Check for license and insurance:</strong> Verify that they are properly licensed and insured. Thoroughly check references and ask for proof of insurance to protect yourself in case of accidents or property damage.
              </li>
            </ul>
          </Paragraph>
          <Title level={2}>Guidelines:</Title>
          <Paragraph>
            <ul>
              <li>
                <strong>Deal Locally:</strong> Whenever possible, deal with businesses or franchises locally. Avoid those who request payment through unconventional methods.
              </li>
              <li>
                <strong>Verify Information:</strong> Before engaging in any transactions, verify the legitimacy of the business or franchise. Check for reviews, ratings, and references from other users. Be cautious of businesses or franchises with limited or no online presence.
              </li>
              <li>
                <strong>Use Secure Payment Methods:</strong> When making payments, use secure and reputable payment methods. Avoid sending cash or wire transfers to unknown parties.
              </li>
              <li>
                <strong>Protect Personal Information:</strong> Avoid sharing sensitive personal information, such as your social security number or bank account details, with unknown parties. Legitimate businesses or franchises will not ask for this information upfront.
              </li>
              <li>
                <strong>Trust Your Instincts:</strong> If something seems too good to be true or feels suspicious, trust your instincts and proceed with caution. Take your time to research and ask questions before committing to any transactions.
              </li>
              <li>
                <strong>Educate Yourself:</strong> Stay informed about common scams and fraudulent schemes. Keep up to date with the latest trends and warnings from reputable sources to protect yourself and others from falling victim to scams.
              </li>
              <li>
                <strong>Be Vigilant:</strong> Scammers are constantly evolving their tactics, so remain vigilant and skeptical of unsolicited offers or requests. Always verify the identity and legitimacy of the parties involved before proceeding with any transactions.
              </li>
            </ul>
          </Paragraph>
          <Paragraph>
            By following these guidelines and protection tips, you can help protect yourself and others from scams and fraudulent activities on SeekNook. If you have any questions or need further assistance, please don't hesitate to contact us.
          </Paragraph>
        </Typography>
      </Content>
    </Layout>
  );
};

export default AvoidScams;
