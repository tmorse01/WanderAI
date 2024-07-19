import React, { useState } from 'react';
import { Container, Select, Title, Loader } from '@mantine/core';
import { useGeolocated } from 'react-geolocated';
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';

const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

export const MapPage = () => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated();
  const [response, setResponse] = useState(null);
  const [preference, setPreference] = useState('scenic');

  const directionsCallback = (response: any) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setResponse(response);
      } else {
        console.log('response: ', response);
      }
    }
  };

  const handlePreferenceChange = (value: any) => {
    setPreference(value);
  };

  const generateRoute = () => {
    if (!coords) return null;

    const waypoints = [
      { location: { lat: coords.latitude + 0.01, lng: coords.longitude }, stopover: false },
      { location: { lat: coords.latitude, lng: coords.longitude + 0.01 }, stopover: false },
      { location: { lat: coords.latitude - 0.01, lng: coords.longitude }, stopover: false },
    ];

    return (
      <DirectionsService
        options={{
          destination: { lat: coords.latitude, lng: coords.longitude },
          origin: { lat: coords.latitude, lng: coords.longitude },
          waypoints: waypoints,
          travelMode: 'WALKING',
        }}
        callback={directionsCallback}
      />
    );
  };

  if (!isGeolocationAvailable) {
    return (
      <Container>
        <Title>Your browser does not support Geolocation</Title>
      </Container>
    );
  }

  if (!isGeolocationEnabled) {
    return (
      <Container>
        <Title>Geolocation is not enabled</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title mb="lg">AI Suggested Walk/Bike Ride</Title>
      <Select
        label="Select your preference"
        placeholder="Pick one"
        data={[
          { value: 'scenic', label: 'Scenic Route' },
          { value: 'shortest', label: 'Shortest Path' },
        ]}
        value={preference}
        onChange={handlePreferenceChange}
        mb="lg"
      />
      {coords ? (
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap
            id="direction-example"
            mapContainerStyle={{
              height: '400px',
              width: '100%',
            }}
            zoom={14}
            center={{
              lat: coords.latitude,
              lng: coords.longitude,
            }}
          >
            {generateRoute()}
            {response !== null && (
              <DirectionsRenderer
                options={{
                  directions: response,
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      ) : (
        <Loader />
      )}
    </Container>
  );
};
