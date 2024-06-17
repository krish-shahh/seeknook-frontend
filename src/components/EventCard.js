import React, { useEffect, useState } from 'react';
import { Card, Tag, Typography, Button } from 'antd';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined, LinkOutlined, CalendarOutlined, LikeOutlined } from '@ant-design/icons';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from '../firebase-config';
import moment from 'moment';

const { Paragraph, Title } = Typography;

// Mapping from value to full description
const eventTypeMapping = {
    concerts: "Concerts Live Music Artist",
    shows: "Shows Comedy Stand-up Fashion",
    local_events: "Local & Community Events",
    childrens_event: "Children's Event",
    festivals: "Festivals Harvest Diwali Holi Ganesha",
    indian_community_events: "Indian Community Events",
    parties: "Parties Bollywood Diwali",
    dance_drama: "Dance & Drama",
    charity_nonprofit: "Charity & Nonprofit",
    exhibits_fairs: "Exhibits Fairs Arts Crafts",
    food_festival: "Food Festival",
    farmers_market: "Farmers Market",
    art_show: "Art Show"
  };

function EventCard({ event }) {

  // Convert timestamps to readable date and time
  const startDate = event.startDate ? moment(event.startDate).format('MMM D · ha') : null;
  const endDate = event.endDate ? moment(event.endDate).format('MMM D · ha') : null;

  const dateDisplay = startDate && endDate ? `${startDate} - ${endDate}` : null;

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(event.likes || 0);

  function formatPhoneNumber(phone) {
    // Strip non-digits from the phone number
    const cleaned = ('' + phone).replace(/\D/g, '');
    // Check if the number length equals to 10
    if (cleaned.length === 10) {
        // Perform formatting
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
    }
    return phone; // Return original on no match or if not 10 digits
  } 

  const toggleLike = async () => {
    // Toggle like state
    const newLiked = !liked;
    setLiked(newLiked);
    const eventRef = doc(db, "events", event.id);
    // Update likes count in the database
    await updateDoc(eventRef, {
      likes: newLiked ? (likesCount + 1) : (likesCount - 1)
    });
    setLikesCount(newLiked ? (likesCount + 1) : (likesCount - 1));
  };

  return (
    <Card
      style={{ marginTop: '20px', border: '1px dashed #d9d9d9', padding: '20px', borderRadius: '10px', width: 400 }}
      title={<Title level={4}>{event.eventName}</Title>}
    >
      {/* Type of Event */}
      {event.typeOfEvent && event.typeOfEvent.map((type, index) => (
        <Tag color="blue" key={index}>{eventTypeMapping[type]}</Tag>
      ))}

      <Paragraph style={{ marginBottom: '10px' }} />

      {/* Date and Time Display */}
      {dateDisplay && (
          <Paragraph>
              <CalendarOutlined style={{ marginRight: '5px' }} />
              {dateDisplay}
          </Paragraph>
      )}

      {/* Description */}
      {event.description && (
        <Paragraph>
          {event.description}
        </Paragraph>
      )}

      {/* Display Preferences */}
      {event.displayPreferences.includes("email") && event.email && (
        <Paragraph>
          <MailOutlined /> {event.email}
        </Paragraph>
      )}
      {event.phone && event.displayPreferences.includes("phone") && (
        <Paragraph>
          <PhoneOutlined /> {formatPhoneNumber(event.phone)}
        </Paragraph>
      )}

      {/* Location and Zipcode */}
      {event.zipcode && (
        <Paragraph>
          <EnvironmentOutlined /> {event.zipcode}
        </Paragraph>
      )}

      {/* Website */}
      {event.website && (
        <Paragraph>
          <LinkOutlined /> <a href={event.website} target="_blank" rel="noopener noreferrer">Visit Event Page</a>
        </Paragraph>
      )}

    {/* Like button and count in the bottom right */}
    <div style={{ alignSelf: 'flex-end' }}>
        <Button shape="circle" icon={<LikeOutlined />} onClick={toggleLike} />
        <span style={{ marginLeft: '8px' }}>{likesCount}</span>
    </div>

    </Card>
  );
}

export default EventCard;
