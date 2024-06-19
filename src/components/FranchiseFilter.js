import React, { useEffect, useState } from 'react';
import { Input, Space, Select, Button, Row, Switch } from 'antd';
import axios from 'axios';

const { Option } = Select;

const FranchiseFilter = ({
  searchTerm, setSearchTerm, filterZip, setFilterZip, serviceType, setServiceType,
  handleSearch, viewType, setViewType, filterPreferences, setFilterPreferences
}) => {
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
    setSearchPlaceholder("Search by Name or Description");
    setZipPlaceholder("Filter by Zip Code");
    setServicePlaceholder("Filter by Service Type");
  };

  const handlePreferenceChange = (value) => {
    setFilterPreferences([value]);
  };

  const selectStyle = {
    width: '100%',
    border: '1px solid black',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  };

  const optionStyle = {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
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
        style={selectStyle}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {serviceOptions.map((service, index) => (
          <Option key={index} value={service} style={optionStyle}>
            {service}
          </Option>
        ))}
      </Select>

      <Row justify="space-between" align="middle">
        <Button onClick={resetAllFilters}>
          Reset All Filters
        </Button>
        <Space>
          <Switch
            checked={viewType === 'list'}
            onChange={(checked) => setViewType(checked ? 'list' : 'default')}
            checkedChildren="List View"
            unCheckedChildren="Card View"
            style={{
              backgroundColor: viewType === 'list' ? 'blue' : 'green',
            }}
          />
        </Space>
      </Row>
    </Space>
  );
};

export default FranchiseFilter;
