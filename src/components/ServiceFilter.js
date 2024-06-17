import React, { useEffect, useState } from 'react';
import { Input, Space, Select, Button, Row } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ServiceFilter = ({ searchTerm, setSearchTerm, filterZip, setFilterZip, serviceType, setServiceType, handleSearch, viewType, setViewType, filterPreferences, setFilterPreferences }) => {
    const [serviceOptions, setServiceOptions] = useState([]);
    const [searchPlaceholder, setSearchPlaceholder] = useState("Search by Name or Description");
    const [zipPlaceholder, setZipPlaceholder] = useState("Filter by Zip Code");
    const [servicePlaceholder, setServicePlaceholder] = useState("Filter by Service Type");

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get('https://seeknook-backend-2564a672bd98.herokuapp.com/api/services');
                setServiceOptions(response.data);
            } catch (error) {
                console.error('Error fetching services from backend:', error);
            }
        };

        fetchServiceTypes();
    }, []);

    const resetAllFilters = () => {
        setSearchTerm('');
        setFilterZip('');
        setServiceType('');
        setFilterPreferences([]);
        setViewType('default');
        setSearchPlaceholder("Search by Name or Description");
        setZipPlaceholder("Filter by Zip Code");
        setServicePlaceholder("Filter by Service Type");
    };

    const handlePreferenceChange = (value) => {
        const viewOptions = ['defaultView', 'listView'];
        if (viewOptions.includes(value)) {
            setViewType(value === 'defaultView' ? 'default' : 'list');
        } else {
            setFilterPreferences(prevPreferences => {
                if (prevPreferences.includes(value)) {
                    return prevPreferences.filter(pref => pref !== value);
                } else {
                    return [...prevPreferences, value];
                }
            });
        }
    };

    return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Input
                placeholder={zipPlaceholder}
                value={filterZip}
                onChange={(e) => setFilterZip(e.target.value)}
                onPressEnter={handleSearch}
                onFocus={() => setZipPlaceholder("")}
                onBlur={() => setZipPlaceholder("Filter by Zip Code")}
                style={{ border: '1px solid black' }}
            />
            <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={handleSearch}
                onFocus={() => setSearchPlaceholder("")}
                onBlur={() => setSearchPlaceholder("Search by Name or Description")}
                style={{ border: '1px solid black' }}
            />
            <Select
                allowClear
                showSearch
                placeholder={servicePlaceholder}
                value={serviceType || undefined}
                onChange={setServiceType}
                onClear={() => setServiceType('')}
                style={{ width: '100%', border: '1px solid black' }}
                dropdownStyle={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {serviceOptions.map((service, index) => (
                    <Option key={index} value={service} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                        {service}
                    </Option>
                ))}
            </Select>

            <Row justify="space-between" align="middle">    
                <Button onClick={resetAllFilters}>
                    Reset All Filters
                </Button>
                <Select
                    placeholder="Additional Filters & View"
                    value={filterPreferences.length > 0 ? filterPreferences[0] : (viewType === 'list' ? 'listView' : 'defaultView')}
                    onChange={handlePreferenceChange}
                    style={{
                        width: 'auto', // Adjust width automatically based on content
                        minWidth: '150px', // Optional: Set a minimum width to ensure it doesn't get too small
                    }}
                >                               
                    <Option value="defaultView">Default View</Option>
                    <Option value="listView">List View</Option>
                    <Option value="groupDiscount">Group Discount</Option>
                    <Option value="licensedInsured">Licensed & Insured</Option>
                    <Option value="deliver">Delivers</Option>
                </Select>               
            </Row>
        </Space>
    );
};

export default ServiceFilter;
