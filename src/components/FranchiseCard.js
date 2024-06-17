import React, { useState } from 'react';
import { Card, Button, Tooltip, Tag } from 'antd';
import {
  PhoneOutlined, MailOutlined, EnvironmentOutlined,
  InstagramOutlined, FacebookOutlined, HeartOutlined, HeartFilled,
  DollarOutlined, LinkOutlined, CheckCircleOutlined,
  LikeOutlined, WhatsAppOutlined, BookFilled, BookOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FranchiseCard({ franchise }) {
  const [liked, setLiked] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [likesCount, setLikesCount] = useState(franchise.likes || 0);
  const [revealPhone, setRevealPhone] = useState(false);
  const [revealEmail, setRevealEmail] = useState(false);
  const navigate = useNavigate();

  const openSocialMedia = (baseURL, userHandle) => {
    if (userHandle) {
      window.open(`${baseURL}/${userHandle}`, '_blank');
    }
  };

  function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    return phone;
  };

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    const newLikesCount = newLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    try {
      const response = await axios.put(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/franchises/${franchise.uuid}/like`, {
        likes: newLikesCount
      });
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const getBorderColor = () => {
    switch (franchise.sponsorStatus) {
      case 'gold':
        return '#ffd700';
      case 'bronze':
        return '#cd7f32';
      default:
        return '#ddd';
    }
  };

  const handleRevealPhone = () => {
    setRevealPhone(true);
  };

  const handleRevealEmail = () => {
    setRevealEmail(true);
  };

  const investmentOptions = {
    below_50k: 'Below 50K',
    below_100k: 'Below 100K',
    below_250k: 'Below 250K',
    below_350k: 'Below 350K',
    below_500k: 'Below 500K',
    below_750k: 'Below 750K',
    below_1m: 'Below 1M',
    over_1m: 'Over 1M'
  };

  return (
    <Card style={{ marginTop: '20px', border: `1px solid ${getBorderColor()}`, borderRadius: '5px', width: '100%', color: 'black' }}>
      <Card.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: 'black', whiteSpace: 'normal' }}>
              {franchise.name}
            </span>
            {franchise.sponsorStatus && (
              <Tooltip title={`${franchise.sponsorStatus.charAt(0).toUpperCase() + franchise.sponsorStatus.slice(1)} Sponsor`}>
                <Tag
                  color={franchise.sponsorStatus === 'gold' ? 'gold' : 'bronze'}
                  style={{
                    fontWeight: 'bold',
                    backgroundColor: franchise.sponsorStatus === 'gold' ? '#ffd700' : '#cd7f32',
                    color: franchise.sponsorStatus === 'gold' ? 'black' : 'white',
                    borderRadius: '5px',
                    fontSize: '12px',
                    padding: '2px 8px'
                  }}
                >
                  <CheckCircleOutlined /> {franchise.sponsorStatus.charAt(0).toUpperCase() + franchise.sponsorStatus.slice(1)}
                </Tag>
              </Tooltip>
            )}
          </div>
        }
        description={(
          <>
            <div style={{ textAlign: 'left', color: 'grey', fontStyle: 'italic', whiteSpace: 'normal' }}>
              {Array.isArray(franchise.service_type) ? franchise.service_type.join(", ") : franchise.service_type}
            </div>
            <p style={{ marginTop: '10px', textAlign: 'left', color: 'black', whiteSpace: 'normal' }}>{franchise.description}</p>
            <p style={{ textAlign: 'left', color: 'black' }}>
              {franchise.phone && franchise.display_preferences.includes("phone") && !revealPhone && (
                <Button onClick={handleRevealPhone} icon={<PhoneOutlined />}>Show Phone</Button>
              )}
              {revealPhone && (
                <>
                  <PhoneOutlined /> <a href={`tel:${franchise.phone}`} style={{ color: 'inherit' }}>{formatPhoneNumber(franchise.phone)}</a>
                </>
              )}
              {franchise.phone && franchise.email && franchise.display_preferences.includes("phone") && franchise.display_preferences.includes("email") && (
                <> | </>
              )}
              {franchise.email && franchise.display_preferences.includes("email") && !revealEmail && (
                <Button onClick={handleRevealEmail} icon={<MailOutlined />}>Show Email</Button>
              )}
              {revealEmail && (
                <>
                  <MailOutlined /> <a href={`mailto:${franchise.email}`} style={{ color: 'inherit' }}>{franchise.email}</a>
                </>
              )}
            </p>
            <p style={{ textAlign: 'left', color: 'black' }}>
              <EnvironmentOutlined /> {franchise.zipcode === '00000' ? 'International' : franchise.zipcode}
              {franchise.investmentAmount && (
                <>
                  {" | "}
                  <DollarOutlined /> Investment:
                  <Tag color="green" style={{ marginLeft: 5, color: 'black' }}>
                    {investmentOptions[franchise.investment_amount]}
                  </Tag>
                </>
              )}
            </p>
            {franchise.website && (
              <p style={{ textAlign: 'left', color: 'black' }}><LinkOutlined /> <a href={franchise.website} target="_blank" rel="noopener noreferrer">Visit Website</a></p>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
              <div>
                {franchise.instagram && (
                  <Button
                    shape="circle"
                    style={{ marginRight: '5px' }}
                    icon={<InstagramOutlined />}
                    onClick={() => openSocialMedia('https://instagram.com', franchise.instagram)}
                  />
                )}
                {franchise.facebook && (
                  <Button
                    shape="circle"
                    style={{ marginRight: '5px' }}
                    icon={<FacebookOutlined />}
                    onClick={() => openSocialMedia('https://facebook.com', franchise.facebook)}
                  />
                )}
                {franchise.whatsapp && (
                  <Tooltip title="WhatsApp Group Link">
                    <Button
                      shape="circle"
                      icon={<WhatsAppOutlined />}
                      onClick={() => window.open(franchise.whatsapp, '_blank')}
                    />
                  </Tooltip>
                )}
              </div>
              <div>
                <Button
                  shape="circle"
                  icon={<LikeOutlined />}
                  onClick={toggleLike}
                />
                <span style={{ marginLeft: '8px' }}>{likesCount}</span>
              </div>
            </div>
          </>
        )}
      />
    </Card>
  );
}

export default FranchiseCard;
