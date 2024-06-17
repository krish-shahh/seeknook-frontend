import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FranchiseCard from '../components/FranchiseCard';
import SearchAndFilter from '../components/ServiceFilter';
import { Spin, Alert, List, Modal, Tag, Pagination } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const FranchisesList = () => {
    const [franchises, setFranchises] = useState([]);
    const [filteredFranchises, setFilteredFranchises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterZip, setFilterZip] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [viewType, setViewType] = useState('default');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFranchise, setSelectedFranchise] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterPreferences, setFilterPreferences] = useState([]);
    const pageSize = 10;

    useEffect(() => {
        fetchFranchises();
    }, []);

    const fetchFranchises = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://seeknook-backend-2564a672bd98.herokuapp.com/api/franchises');
            const franchiseData = response.data;

            setFranchises(franchiseData);
            setFilteredFranchises(franchiseData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching franchises from backend:', error);
            setError('Failed to fetch franchises.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [searchTerm, filterZip, serviceType, filterPreferences, franchises]);

    const applyFilters = () => {
        let result = franchises;
        if (searchTerm) {
            result = result.filter(f =>
                f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                f.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterZip) {
            result = result.filter(f => f.zipcode.includes(filterZip));
        }
        if (serviceType) {
            result = result.filter(f =>
                f.service_type && f.service_type.some(type => type.toLowerCase().includes(serviceType.toLowerCase()))
            );
        }
        if (filterPreferences.length > 0) {
            result = result.filter(f =>
                filterPreferences.every(pref =>
                    f.display_preferences && f.display_preferences.includes(pref)
                )
            );
        }
        setFilteredFranchises(result);
    };

    const handleFranchiseClick = (franchise) => {
        setSelectedFranchise(franchise);
    };

    const closeModal = () => {
        setSelectedFranchise(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedFranchises = filteredFranchises.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                            dataSource={paginatedFranchises}
                            renderItem={franchise => (
                                <List.Item onClick={() => handleFranchiseClick(franchise)} style={{ cursor: 'pointer', wordWrap: 'break-word' }}>
                                    <List.Item.Meta
                                        title={
                                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                                <span style={{ marginRight: '10px', wordBreak: 'break-word' }}>{franchise.name}</span>
                                                {franchise.sponsorStatus && (
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
                                                )}
                                                <span style={{ marginRight: '10px', wordBreak: 'break-word', color: 'gray', fontStyle: 'italic' }}>{franchise.service_type.join(', ')}</span>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        paginatedFranchises.map(franchise => (
                            <div className="col-12 col-md-4 mb-3" key={franchise.id}>
                                <FranchiseCard franchise={franchise} />
                            </div>
                        ))
                    )
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredFranchises.length}
                    onChange={handlePageChange}
                    showSizeChanger
                    pageSizeOptions={['9', '18', '27']}
                />
            </div>

            <Modal
                visible={!!selectedFranchise}
                onCancel={closeModal}
                footer={null}
                centered
                width={window.innerWidth <= 768 ? '100%' : '50%'}
            >
                {selectedFranchise && <FranchiseCard franchise={selectedFranchise} />}
            </Modal>
        </div>
    );
};

export default FranchisesList;
