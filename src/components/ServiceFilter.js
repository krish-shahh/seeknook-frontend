import React, { useEffect, useState } from 'react';
import { Input, Space, Button, Row, Switch } from 'antd';
import Select from 'react-select';
import axios from 'axios';

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

  const additionalFiltersOptions = [
    { value: 'groupDiscount', label: 'Group Discount' },
    { value: 'licensedInsured', label: 'Licensed & Insured' },
    { value: 'deliver', label: 'Delivers' },
    { value: 'hiring', label: 'Hiring' },
  ];
  
  const handlePreferenceChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : '';
    setFilterPreferences(selectedValue ? [selectedValue] : []);
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
        styles={{
          control: (base) => ({
            ...base,
            border: '1px solid black',
          }),
        }}
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
          value={additionalFiltersOptions.find(option => filterPreferences.includes(option.value)) || null}
          onChange={handlePreferenceChange}
          options={additionalFiltersOptions}
          isClearable
          styles={{
            control: (base) => ({
              ...base,
              minWidth: '160px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }),
          }}
        />
      </Row>
    </Space>
  );
};

export default ServiceFilter;
