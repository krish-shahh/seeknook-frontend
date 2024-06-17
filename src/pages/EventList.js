import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import EventCard from '../components/EventCard';
import EventFilter from '../components/EventFilter';
import { Spin, Alert, Pagination } from 'antd';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterZip, setFilterZip] = useState('');
    const [eventType, setEventType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        setIsLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "events"));
            let eventData = querySnapshot.docs.map(doc => ({
                id: doc.id, 
                ...doc.data(),
                likes: doc.data().likes || 0 // Ensure likes are defined and default to 0 if not set
            }));
            // Sort events by likes in descending order
            eventData.sort((a, b) => b.likes - a.likes);
            setEvents(eventData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching events from Firestore:', error);
            setError('Failed to fetch events.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [searchTerm, filterZip, eventType, events]);

    const applyFilters = () => {
        let result = events;
        if (searchTerm) {
            result = result.filter(e =>
                e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterZip) {
            result = result.filter(e => e.zipcode && e.zipcode.includes(filterZip));
        }
        if (eventType) {
            result = result.filter(e => e.eventType && e.eventType.some(type => type === eventType));
        }
        setFilteredEvents(result.slice(0, 9)); // Adjust this to handle pagination if necessary
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mt-3">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <EventFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterZip={filterZip}
                        setFilterZip={setFilterZip}
                        eventType={eventType}
                        setEventType={setEventType}
                        handleSearch={applyFilters}
                    />
                </div>
            </div>
            <div className="row mt-3 justify-content-center">
                {error && <Alert type="error" message={error} />}
                {isLoading ? (
                    <Spin size="large" />
                ) : (
                    filteredEvents.map(event => (
                        <div className="col-12 col-sm-6 col-md-4 mb-3" key={event.id}>
                            <EventCard event={event} />
                        </div>
                    ))
                )}
            </div>
            {/* Pagination could be enabled here if necessary */}
        </div>
    );
};

export default EventList;
