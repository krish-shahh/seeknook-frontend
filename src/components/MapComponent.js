import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import loadZipCodeData from './loadZipCodeData';

const MapComponent = ({ onResetMap }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const initialViewRef = useRef(null);
  const [zipData, setZipData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const zipCodeData = await loadZipCodeData();
      const querySnapshot = await getDocs(collection(db, 'businesses'));
      const businesses = querySnapshot.docs.map((doc) => doc.data());

      const mappedData = businesses
        .map((business) => {
          const zip = business.zipcode;
          const location = zipCodeData[zip];
          if (!location) {
            console.warn(`No location found for zip code: ${zip}`);
            return null;
          }
          return {
            ...business,
            lat: location.lat,
            lng: location.lng,
            city: location.city,
            state_id: location.state_id,
            county_name: location.county_name,
          };
        })
        .filter((business) => business && business.lat && business.lng); // Filter out businesses without coordinates

      console.log('Mapped Data:', mappedData);
      setZipData(mappedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (zipData.length === 0) return;

    const features = zipData.map((zip) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([zip.lng, zip.lat])),
        name: zip.city,
      });
      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: 'red' }),
            stroke: new Stroke({ color: 'black', width: 1 }),
          }),
        })
      );
      return feature;
    });

    const vectorSource = new VectorSource({
      features: features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const initialView = new View({
      center: fromLonLat([-96, 37.8]), // Center the map over the US
      zoom: 4,
    });

    initialViewRef.current = initialView;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: initialView,
    });

    mapInstance.current = map;

    if (onResetMap) {
      onResetMap(() => {
        map.getView().setCenter(fromLonLat([-96, 37.8]));
        map.getView().setZoom(4);
      });
    }

    return () => map.setTarget(null); // Clean up on unmount
  }, [zipData, onResetMap]);

  if (loading) {
    return <p>Loading map...</p>;
  }

  return <div ref={mapRef} style={{ width: '100%', height: '500px', marginBottom: '10px' }} />;
};

export default MapComponent;