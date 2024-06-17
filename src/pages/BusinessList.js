import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase-config'; // Assuming you have firebase-config for authentication
import BusinessCard from '../components/BusinessCard';
import SearchAndFilter from '../components/ServiceFilter';
import { Spin, Alert, List, Modal, Tag, Pagination } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const BusinessList = () => {
    const [businesses, setBusinesses] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterZip, setFilterZip] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [viewType, setViewType] = useState('default');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [filterPreferences, setFilterPreferences] = useState([]);
    const [userUid, setUserUid] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUserUid(currentUser.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://seeknook-backend-2564a672bd98.herokuapp.com/api/businesses');
            const businessData = response.data;

            setBusinesses(businessData);
            setFilteredBusinesses(businessData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching businesses from backend:', error);
            setError('Failed to fetch businesses.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [searchTerm, filterZip, serviceType, filterPreferences, businesses]);

    const applyFilters = () => {
        let result = businesses;
        if (searchTerm) {
            result = result.filter(b =>
                b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterZip) {
            result = result.filter(b => b.zipcode.includes(filterZip));
        }
        if (serviceType) {
            result = result.filter(b => 
                b.service_type && b.service_type.some(type => type.toLowerCase().includes(serviceType.toLowerCase()))
            );
        }
        if (filterPreferences.length > 0) {
            const preferences = filterPreferences.filter(pref => !['defaultView', 'listView'].includes(pref));
            result = result.filter(b => 
                preferences.every(pref => {
                    if (pref === 'deliver') {
                        return b.business_type && b.business_type.includes('deliver');
                    } else {
                        return b.display_preferences && b.display_preferences.includes(pref);
                    }
                })
            );
        }
        setFilteredBusinesses(result);
        if (filterPreferences.includes('listView')) {
            setViewType('list');
        } else {
            setViewType('default');
        }
    };

    const handleBusinessClick = (business) => {
        setSelectedBusiness(business);
    };

    const closeModal = () => {
        setSelectedBusiness(null);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const paginatedBusinesses = filteredBusinesses.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <SearchAndFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterZip={filterZip}
                    setFilterZip={setFilterZip}
                    serviceType={serviceType}
                    setServiceType={setServiceType}
                    handleSearch={applyFilters}
                    viewType={viewType}
                    setViewType={setViewType}
                    filterPreferences={filterPreferences}
                    setFilterPreferences={setFilterPreferences}
                />
            </div>
            <div className="row mt-3 justify-content-center">
                {error && <Alert type="error" message={error} />}
                {isLoading ? (
                    <Spin size="large" />
                ) : (
                    viewType === 'list' ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={paginatedBusinesses}
                            renderItem={business => (
                                <List.Item onClick={() => handleBusinessClick(business)} style={{ cursor: 'pointer', wordWrap: 'break-word' }}>
                                    <List.Item.Meta
                                        title={
                                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                                <span style={{ marginRight: '10px', wordBreak: 'break-word' }}>{business.name}</span>
                                                {business.sponsorStatus && (
                                                    <Tag
                                                        color={business.sponsorStatus === 'gold' ? 'gold' : 'bronze'}
                                                        style={{
                                                            fontWeight: 'bold',
                                                            backgroundColor: business.sponsorStatus === 'gold' ? '#ffd700' : '#cd7f32',
                                                            color: business.sponsorStatus === 'gold' ? 'black' : 'white',
                                                            borderRadius: '5px',
                                                            fontSize: '12px',
                                                            padding: '2px 8px'
                                                        }}
                                                    >
                                                        <CheckCircleOutlined /> {business.sponsorStatus.charAt(0).toUpperCase() + business.sponsorStatus.slice(1)}
                                                    </Tag>
                                                )}
                                                <span style={{ marginRight: '10px', wordBreak: 'break-word', color: 'gray', fontStyle: 'italic'}}>{business.service_type.join(', ')}</span>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        paginatedBusinesses.map(business => (
                            <div className="col-12 col-md-4 mb-3" key={business.id}>
                                <BusinessCard business={business} userUid={userUid} />
                            </div>
                        ))
                    )
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredBusinesses.length}
                    onChange={handlePageChange}
                    showSizeChanger
                    pageSizeOptions={['9', '18', '27']}
                />
            </div>

            <Modal
                visible={!!selectedBusiness}
                onCancel={closeModal}
                footer={null}
                centered
                width={window.innerWidth <= 768 ? '100%' : '50%'}
            >
                {selectedBusiness && <BusinessCard business={selectedBusiness} userUid={userUid} />}
            </Modal>
        </div>
    );    
};

export default BusinessList;
