import React, { useEffect, useState } from 'react';
import { Input, Space, Button, Row, Switch } from 'antd';
import Select from 'react-select';
import axios from 'axios';

const { Option } = Select;

const ServiceFilter = ({
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
        isClearable
        isSearchable
        placeholder={servicePlaceholder}
        value={serviceType ? { value: serviceType, label: serviceType } : null}
        onChange={(selectedOption) => setServiceType(selectedOption ? selectedOption.value : '')}
        options={serviceOptions.map((service, index) => ({
          value: service,
          label: service,
        }))}
        style={{ border: '1px solid black' }}
      />

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
        <Select
          placeholder="Additional Filters"
          value={filterPreferences[0] || undefined}
          onChange={handlePreferenceChange}
          style={{
            width: 'auto', // Adjust width automatically based on content
            minWidth: '160px', // Optional: Set a minimum width to ensure it doesn't get too small
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}
        >
          <Option value="groupDiscount">Group Discount</Option>
          <Option value="licensedInsured">Licensed & Insured</Option>
          <Option value="deliver">Delivers</Option>
          <Option value="hiring">Hiring</Option>
        </Select>
      </Row>
    </Space>
  );
};

export default ServiceFilter;
