// app/citymap/map.jsx
"use client";
import { useEffect, useRef, useState, useCallback } from 'react';

export default function CityMap() {
  const mapRef = useRef(null);
  const [status, setStatus] = useState("Loading map...");
  const [markers, setMarkers] = useState([]);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const map = useRef(null);
  const service = useRef(null);
  const scriptLoaded = useRef(false);

  const clearMarkers = useCallback(() => {
    markers.forEach(marker => marker?.setMap(null));
    setMarkers([]);
  }, [markers]);

  const createMarker = useCallback((place) => {
    if (!window.google || !map.current) {
      console.error('Google Maps not loaded yet');
      return;
    }
    
    if (!place.geometry || !place.geometry.location) {
      console.log("Returned place contains no geometry");
      return;
    }
    
    try {
      const marker = new google.maps.Marker({
        map: map.current,
        position: place.geometry.location,
        title: place.name,
        animation: google.maps.Animation.DROP
      });

      const infoContent = `
        <div style="max-width: 250px; font-family: Arial, sans-serif;">
          <strong style="font-size: 16px;">${place.name}</strong>
          <p style="margin: 8px 0; font-size: 14px;">${place.formatted_address || place.vicinity || "No address available"}</p>
          ${place.rating ? `<p style="margin: 5px 0; font-size: 14px;">Rating: ${place.rating} ⭐</p>` : ''}
        </div>
      `;
      
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });

      marker.addListener('click', () => {
        infoWindow.open(map.current, marker);
      });

      setMarkers(prevMarkers => [...prevMarkers, marker]);
    } catch (error) {
      console.error('Error creating marker:', error);
    }
  }, []);

  const filterPlacesByText = useCallback((query) => {
    console.log('filterPlacesByText called with:', query);
    if (!isGoogleMapsLoaded || !map.current || !service.current) {
      console.log('Map not ready:', { isGoogleMapsLoaded, hasMap: !!map.current, hasService: !!service.current });
      setStatus("Map not ready yet");
      return;
    }
    
    clearMarkers();
    setStatus(`Searching for "${query}"...`);

    const request = {
      query: query,
      location: map.current.getCenter(),
      radius: 10000
    };

    service.current.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        setStatus(`Found ${results.length} results for "${query}"`);
        console.log('Search results:', results);
        
        results.forEach(result => createMarker(result));
        
        if (results.length > 1) {
          const bounds = new google.maps.LatLngBounds();
          results.forEach(result => bounds.extend(result.geometry.location));
          map.current.fitBounds(bounds);
        }
      } else {
        setStatus(`No results found for "${query}". Try a different search term.`);
        console.log('No places found. Status:', status);
      }
    });
  }, [isGoogleMapsLoaded, clearMarkers, createMarker]);

  const filterPlacesByType = useCallback((type) => {
    if (!isGoogleMapsLoaded || !map.current || !service.current) {
      setStatus("Map not ready yet");
      return;
    }
    
    clearMarkers();
    setStatus(`Searching for ${type} services...`);

    const request = {
      location: map.current.getCenter(),
      radius: 20000,
      type: type
    };

    service.current.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        setStatus(`Found ${results.length} ${type} services`);
        
        results.forEach(result => createMarker(result));
        
        const bounds = new google.maps.LatLngBounds();
        results.forEach(result => bounds.extend(result.geometry.location));
        map.current.fitBounds(bounds);
      } else {
        setStatus(`No ${type} services found. Trying alternative search...`);
        filterPlacesByText(`${type}s in Los Angeles`);
      }
    });
  }, [isGoogleMapsLoaded, clearMarkers, createMarker, filterPlacesByText]);

  const initMap = useCallback(() => {
    console.log('initMap called', { hasMap: !!map.current });
    
    // Prevent re-initialization if map already exists
    if (map.current) {
      console.log('Map already initialized');
      return;
    }
    
    if (!window.google || !mapRef.current) {
      console.error('Cannot initialize map - dependencies not ready');
      return;
    }

    const losAngeles = { lat: 34.065053, lng: -118.239130 };
    
    const mapStyles = [
      {
        featureType: "all",
        elementType: "geometry.fill",
        stylers: [{ saturation: -100 }]
      },
      {
        featureType: "poi",
        elementType: "labels.text",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "transit",
        stylers: [{ visibility: "off" }]
      }
    ];
    
    try {
      map.current = new google.maps.Map(mapRef.current, {
        center: losAngeles,
        zoom: 12,
        styles: mapStyles,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
      });
      
      service.current = new google.maps.places.PlacesService(map.current);
      setIsGoogleMapsLoaded(true);
      setStatus("Map loaded. Click a button to see local resources.");
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      setStatus("Error loading map");
    }
  }, []);

  useEffect(() => {
    if (window.google && window.google.maps) {
      initMap();
      return;
    }
    
    if (scriptLoaded.current) {
      return;
    }

    scriptLoaded.current = true;
    
    const loadGoogleMaps = () => {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        if (window.google && window.google.maps) {
          initMap();
        } else {
          existingScript.onload = () => initMap();
        }
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDmZPHOFE3FuFd3FrDb6pbA5faXNZ6PK54&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initMap();
      };
      script.onerror = () => {
        console.error('Error loading Google Maps script');
        setStatus("Error loading Google Maps");
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      if (markers.length > 0) {
        markers.forEach(marker => marker?.setMap(null));
      }
    };
  }, [initMap, markers]);

  return (
    <div className="px-4 py-6 pt-16">
      <h1 className="text-2xl font-bold text-center mb-5">Community Resource Map</h1>
      <p className="text-center mb-7 text-gray-600">Find helpful resources in your community. Use the filters below to locate specific services.</p>
      
      <div ref={mapRef} className="h-[500px] w-full mb-5 border border-gray-300 rounded-md" />
      
      <div className="flex justify-center my-5 space-x-5">
        <button 
          className={`px-5 py-2 ${isGoogleMapsLoaded ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400'} text-white font-bold rounded cursor-pointer`}
          onClick={() => {
            console.log('Homeless Shelters button clicked');
            filterPlacesByText('homeless shelters in Los Angeles');
          }}
          disabled={!isGoogleMapsLoaded}
        >
          Homeless Shelters
        </button>
        <button 
          className={`px-5 py-2 ${isGoogleMapsLoaded ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400'} text-white font-bold rounded cursor-pointer`}
          onClick={() => {
            console.log('Food Centers button clicked');
            filterPlacesByText('food banks in Los Angeles');
          }}
          disabled={!isGoogleMapsLoaded}
        >
          Food Centers
        </button>
        <button 
          className={`px-5 py-2 ${isGoogleMapsLoaded ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400'} text-white font-bold rounded cursor-pointer`}
          onClick={() => {
            console.log('Medical Services button clicked');
            filterPlacesByType('hospital');
          }}
          disabled={!isGoogleMapsLoaded}
        >
          Medical Services
        </button>
      </div>
      
      <div className="my-4 p-2.5 text-red-600 text-center font-bold">
        Status: {status}
        <br />
        <small>Map loaded: {isGoogleMapsLoaded ? 'Yes' : 'No'}</small>
      </div>
      
      <div className="grid grid-cols-3 gap-5 mt-7">
        <div className="bg-gray-100 border border-gray-300 rounded-md overflow-hidden">
          <div className="h-[180px] bg-gray-300 flex items-center justify-center text-gray-600">
            Image Placeholder
          </div>
          <p className="p-3.5 m-0">View homeless shelters and housing assistance programs in your area.</p>
        </div>
        
        <div className="bg-gray-100 border border-gray-300 rounded-md overflow-hidden">
          <div className="h-[180px] bg-gray-300 flex items-center justify-center text-gray-600">
            Image Placeholder
          </div>
          <p className="p-3.5 m-0">Locate food banks and meal programs for individuals and families in need.</p>
        </div>
        
        <div className="bg-gray-100 border border-gray-300 rounded-md overflow-hidden">
          <div className="h-[180px] bg-gray-300 flex items-center justify-center text-gray-600">
            Image Placeholder
          </div>
          <p className="p-3.5 m-0">Find medical services including free and low-cost healthcare providers.</p>
        </div>
      </div>
    </div>
  );
}