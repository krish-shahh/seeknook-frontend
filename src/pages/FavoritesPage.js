import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import { collection, doc, getDoc } from "firebase/firestore";
import BusinessCard from '../components/BusinessCard';
import FranchiseCard from '../components/FranchiseCard';

function FavoritesPage() {
  const [favoriteBusinesses, setFavoriteBusinesses] = useState([]);
  const [favoriteFranchises, setFavoriteFranchises] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    if (!auth.currentUser) {
      console.log("User not logged in");
      return;
    }
    
    const favRef = doc(db, "favorites", auth.currentUser.email);
    const favSnap = await getDoc(favRef);
    if (favSnap.exists()) {
      const favorites = favSnap.data();
      const businessIds = Object.keys(favorites).filter(key => favorites[key] === true); // Get all business IDs that are true
      const franchiseIds = Object.keys(favorites).filter(key => favorites[key] === true);
      fetchBusinessDetails(businessIds);
      fetchFranchiseDetails(franchiseIds);
    }
  };

  const fetchBusinessDetails = async (businessIds) => {
    const promises = businessIds.map(id => 
      getDoc(doc(db, "businesses", id))
    );
    const docs = await Promise.all(promises);
    const businesses = docs.filter(doc => doc.exists()).map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setFavoriteBusinesses(businesses);
  };

  const fetchFranchiseDetails = async (franchiseIds) => {
    const promises = franchiseIds.map(id => 
      getDoc(doc(db, "franchises", id))
    );
    const docs = await Promise.all(promises);
    const franchises = docs.filter(doc => doc.exists()).map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setFavoriteFranchises(franchises);
  };

  return (
    <div className="container text-center mt-4"> {/* Add margin-top */}
      <h2>Favorite Businesses</h2>
      <div className="row justify-content-center"> {/* Center the row */}
        {favoriteBusinesses.length > 0 ? favoriteBusinesses.map(business => (
          <div className="col-12 col-sm-6 col-md-4 mb-3" key={business.id}>
            <BusinessCard business={business} />
          </div>
        )) : <p>No favorite businesses found.</p>}
      </div>
      <h2>Favorite Franchises</h2>
      <div className="row justify-content-center"> {/* Center the row */}
        {favoriteFranchises.length > 0 ? favoriteFranchises.map(franchises => (
          <div className="col-12 col-sm-6 col-md-4 mb-3" key={franchises.id}>
            <FranchiseCard franchises={franchises} />
          </div>
        )) : <p>No favorite franchises found.</p>}
      </div>
    </div>
  );
}

export default FavoritesPage;
