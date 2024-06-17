import React from 'react';
import { Input, Space, Select, Button } from 'antd';

const { Option } = Select;

const EventFilter = ({ searchTerm, setSearchTerm, filterZip, setFilterZip, eventType, setEventType, handleSearch }) => {
    const eventOptions = [
        { key: "concerts", label: "Concerts Live Music Artist" },
        { key: "shows", label: "Shows Comedy Stand-up Fashion" },
        { key: "local_events", label: "Local & Community Events" },
        { key: "childrens_event", label: "Children's Event" },
        { key: "festivals", label: "Festivals Harvest Diwali Holi Ganesha" },
        { key: "indian_community_events", label: "Indian Community Events" },
        { key: "parties", label: "Parties Bollywood Diwali" },
        { key: "dance_drama", label: "Dance & Drama" },
        { key: "charity_nonprofit", label: "Charity & Nonprofit" },
        { key: "exhibits_fairs", label: "Exhibits Fairs Arts Crafts" },
        { key: "food_festival", label: "Food Festival" },
        { key: "farmers_market", label: "Farmers Market" },
        { key: "art_show", label: "Art Show" }
    ];

    const resetAllFilters = () => {
        setSearchTerm('');
        setFilterZip('');
        setEventType('');
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Input
                placeholder="Search by Name or Description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={handleSearch}
            />
            <Input
                placeholder="Filter by Zip Code"
                value={filterZip}
                onChange={(e) => setFilterZip(e.target.value)}
                onPressEnter={handleSearch}
            />
            <Select
                allowClear
                showSearch
                placeholder="Filter by Event Type"
                value={eventType}
                onChange={setEventType}
                onClear={() => setEventType('')}
                style={{ width: '100%' }}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {eventOptions.map(option => (
                    <Option key={option.key} value={option.key}>{option.label}</Option>
                ))}
            </Select>
            
            <Button onClick={resetAllFilters} style={{ marginTop: '10px' }}>
                Reset All Filters
            </Button>
            
        </Space>
    );
};

export default EventFilter;
