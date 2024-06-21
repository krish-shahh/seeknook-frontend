import React, { useState, useEffect } from 'react';
import { Card, Button, Tooltip, Tag, Badge } from 'antd';
import {
  PhoneOutlined, MailOutlined, EnvironmentOutlined,
  InstagramOutlined, FacebookOutlined, HeartOutlined, HeartFilled,
  SafetyOutlined, TeamOutlined, LinkOutlined, CheckCircleOutlined,
  CrownOutlined, CarOutlined, LikeOutlined, WhatsAppOutlined, SearchOutlined, LikeFilled, PaperClipOutlined, ShareAltOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loadZipCodeData from '../components/loadZipCodeData'; // Ensure this imports correctly

function BusinessCard({ business }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(business.likes);
  const [favorite, setFavorite] = useState(false);
  const [favorites, setFavorites] = useState(business.favorites || []);
  const [revealPhone, setRevealPhone] = useState(false);
  const [revealEmail, setRevealEmail] = useState(false);
  const [zipCodeData, setZipCodeData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadZipCodeData().then(setZipCodeData);
  }, []);

  const openSocialMedia = (baseURL, userHandle) => {
    if (userHandle) {
      window.open(`${baseURL}/${userHandle}`, '_blank');
    }
  };

  const shareBusiness = () => {
    const shareText = `
      Check out this business on SeekNook:
      
      Name: ${business.name}
      Description: ${business.description}
      Phone: ${formatPhoneNumber(business.phone)}
      Email: ${business.email}
      Location: ${business.zipcode} ${business.city}
      
      Visit SeekNook for more details: ${window.location.href}
    `;
  
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: shareText,
        url: window.location.href,
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers that do not support the Web Share API
      const shareUrl = `mailto:?subject=${encodeURIComponent(business.name)}&body=${encodeURIComponent(shareText)}`;
      window.location.href = shareUrl;
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

  const getBorderColor = () => {
    switch (business.payment_preferences) {
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

  const getServiceAreaLabel = (serviceArea) => {
    if (!business.zipcode) return serviceArea;
    const zipDetails = zipCodeData[business.zipcode];
    if (!zipDetails) return serviceArea;

    const state = zipDetails.state_id;
    const city = zipDetails.city;
    const serviceAreaMapping = {
      [`${city.toLowerCase()}_only`]: `${city} Only`,
      [`anywhere_${state.toLowerCase()}`]: `All ${state}`,
      [`central_${state.toLowerCase()}`]: `Central ${state}`,
      [`south_${state.toLowerCase()}`]: `South ${state}`,
      [`north_${state.toLowerCase()}`]: `North ${state}`,
      anywhere_remotely: "Remotely",
      do_not_display: "Do Not Display"
    };
    return serviceAreaMapping[serviceArea] || serviceArea;
  };

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    const newLikesCount = newLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    try {
      const response = await axios.put(`https://seeknook-backend-2564a672bd98.herokuapp.com/api/businesses/${business.uuid}/like`, {
        likes: newLikesCount
      });
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const isNewBusiness = () => {
    const createdAt = new Date(business.created_at);
    const now = new Date();
    const timeDifference = now - createdAt;
    return timeDifference <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };

  return (
    <Badge.Ribbon text="New" color="gray" style={{ display: isNewBusiness() ? 'inline-block' : 'none' }}>
      <Card style={{ marginTop: '10px', border: `1px solid ${getBorderColor()}`, borderRadius: '5px', width: '100%', color: 'black' }}>
        <Card.Meta
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: 'black', whiteSpace: 'normal' }}>
                {business.name}
              </span>
              {business.payment_preferences && (
                <Tooltip title={`${business.payment_preferences.charAt(0).toUpperCase() + business.payment_preferences.slice(1)} Sponsor`}>
                  <Tag
                    color={business.payment_preferences === 'gold' ? 'gold' : 'bronze'}
                    style={{
                      fontWeight: 'bold',
                      backgroundColor: business.payment_preferences === 'gold' ? '#ffd700' : '#cd7f32',
                      color: business.payment_preferences === 'gold' ? 'black' : 'white',
                      borderRadius: '5px',
                      fontSize: '12px',
                      padding: '2px 8px'
                    }}
                  >
                    <CheckCircleOutlined /> {business.payment_preferences.charAt(0).toUpperCase() + business.payment_preferences.slice(1)}
                  </Tag>
                </Tooltip>
              )}
            </div>
          }
          description={(
            <>
              <div style={{ textAlign: 'left', color: 'grey', fontStyle: 'italic', whiteSpace: 'normal'}}>
                {Array.isArray(business.service_type) ? business.service_type.join(", ") : business.service_type}
              </div>
              <p style={{ marginTop: '10px', textAlign: 'left', color: 'black', whiteSpace: 'normal' }}>{business.description}</p>
              <p style={{ textAlign: 'left', color: 'black' }}>
                {business.phone && business.display_preferences.includes("phone") && !revealPhone && (
                  <Button onClick={handleRevealPhone} icon={<PhoneOutlined />}>Show Phone</Button>
                )}
                {revealPhone && (
                  <>
                    <PhoneOutlined /> <a href={`tel:${business.phone}`} style={{ color: 'inherit' }}>{formatPhoneNumber(business.phone)}</a>
                  </>
                )}
                {business.phone && business.email && business.display_preferences.includes("phone") && business.display_preferences.includes("email") && (
                  <> | </>
                )}
                {business.email && business.display_preferences.includes("email") && !revealEmail && (
                  <Button onClick={handleRevealEmail} icon={<MailOutlined />}>Show Email</Button>
                )}
                {revealEmail && (
                  <>
                    <MailOutlined /> <a href={`mailto:${business.email}`} style={{ color: 'inherit' }}>{business.email}</a>
                  </>
                )}
              </p>
              {(business.website || business.display_preferences.includes("militaryDiscount")) && (
                <p style={{ textAlign: 'left', color: 'black' }}>
                  {business.website && (
                    <>
                      <LinkOutlined /> <a href={business.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>Visit Website</a>
                    </>
                  )}
                  {business.website && business.display_preferences.includes("militaryDiscount") && (
                    <> | </>
                  )}
                  {business.display_preferences.includes("militaryDiscount") && (
                    <>
                      <CrownOutlined /> Military/Veteran Owned
                    </>
                  )}
                </p>
              )}
              {business.zipcode && (
                <p style={{ textAlign: 'left', color: 'black' }}>
                  <EnvironmentOutlined /> {business.zipcode}
                  {business.display_preferences.includes("city") && business.city && (
                    <>
                      {" | "} 
                      <CheckCircleOutlined /> Located in {business.city}
                    </>
                  )}
                </p>
              )}
              {(business.display_preferences.includes("groupDiscount") || business.display_preferences.includes("licensedInsured")) && (
                <p style={{ textAlign: 'left', color: 'black' }}>
                  {business.display_preferences.includes("groupDiscount") && (
                    <>
                      <TeamOutlined /> Offers Group Discount
                    </>
                  )}
                  {business.display_preferences.includes("groupDiscount") && business.display_preferences.includes("licensedInsured") && (
                    <> | </>
                  )}
                  {business.display_preferences.includes("licensedInsured") && (
                    <>
                      <SafetyOutlined /> Licensed & Insured
                    </>
                  )}
                </p>
              )}
              {(business.service_area && business.service_area !== "do_not_display") || business.business_type.includes("residential") || business.business_type.includes("commercial") ? (
                <div style={{ textAlign: 'left', color: 'black', marginTop: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  {business.service_area && business.service_area !== "do_not_display" && (
                    <span><SearchOutlined /> Serves: {getServiceAreaLabel(business.service_area)} | </span>
                  )}
                  {(business.business_type.includes("residential") && business.business_type.includes("commercial")) ? (
                    <Tag color="purple" style={{ marginLeft: '4px' }}>Residential Commercial</Tag>
                  ) : (
                    <>
                      {business.business_type.includes("residential") && (
                        <Tag color="blue" style={{ marginLeft: business.service_area && business.service_area !== "do_not_display" ? '4px' : '0' }}>Residential</Tag>
                      )}
                      {business.business_type.includes("commercial") && (
                        <Tag color="green" style={{ marginLeft: business.business_type.includes("residential") ? '4px' : (business.service_area && business.service_area !== "do_not_display" ? '4px' : '0') }}>Commercial</Tag>
                      )}
                    </>
                  )}
                </div>
              ) : null}
              {business.business_type.includes("deliver") && (
                <p style={{ textAlign: 'left', color: 'black', marginTop: '10px' }}>
                  <CarOutlined /> Delivers
                </p>
              )}
              {business.display_preferences.includes("hiring") && (
                <p style={{ textAlign: 'left', color: 'black', marginTop: '10px' }}>
                  <PaperClipOutlined /> We are Hiring
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <div>
                  {business.instagram && (
                    <Button
                      shape="circle"
                      style={{ marginRight: '5px' }}
                      icon={<InstagramOutlined />}
                      onClick={() => openSocialMedia('https://instagram.com', business.instagram)}
                    />
                  )}
                  {business.facebook && (
                    <Button
                      shape="circle"
                      style={{ marginRight: '5px' }}
                      icon={<FacebookOutlined />}
                      onClick={() => openSocialMedia('https://facebook.com', business.facebook)}
                    />
                  )}
                  {business.whatsapp && (
                    <Tooltip title="WhatsApp Group Link">
                      <Button
                        shape="circle"
                        icon={<WhatsAppOutlined />}
                        onClick={() => window.open(business.whatsapp, '_blank')}
                      />
                    </Tooltip>
                  )}
                </div>
                <div>
                  <Button
                    shape="circle"
                    icon={<ShareAltOutlined />}
                    onClick={shareBusiness}
                  />
                </div>
                <div>
                  <Button
                    shape="circle"
                    icon={liked ? <LikeFilled /> : <LikeOutlined />}
                    onClick={toggleLike}
                  />
                  <span style={{ marginLeft: '8px' }}>{likesCount}</span>
                </div>
              </div>
            </>
          )}
        />
      </Card>
    </Badge.Ribbon>
  );
}

export default BusinessCard;
