"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

export default function CityMap() {
  const mapRef = useRef(null);
  const [status, setStatus] = useState("Loading map...");
  const [markers, setMarkers] = useState([]);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeMode, setRouteMode] = useState('DRIVING');
  const [activePanel, setActivePanel] = useState('map'); // 'map', 'directions'
  const [searchQuery, setSearchQuery] = useState('');
  const map = useRef(null);
  const service = useRef(null);
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);
  const scriptLoaded = useRef(false);
  const infoWindows = useRef([]);
  const searchBoxRef = useRef(null);
  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);

  const clearMarkers = useCallback(() => {
    markers.forEach(marker => marker?.setMap(null));
    setMarkers([]);
    
    // Close all info windows
    infoWindows.current.forEach(window => window?.close());
    infoWindows.current = [];
    
    // Clear any existing routes if not in directions mode
    if (directionsRenderer.current && activePanel !== 'directions') {
      directionsRenderer.current.setMap(null);
      setSelectedRoute(null);
      setRouteInfo(null);
    }
  }, [markers, activePanel]);

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
        <div style="max-width: 300px; font-family: Arial, sans-serif;">
          <strong style="font-size: 16px;">${place.name}</strong>
          <p style="margin: 8px 0; font-size: 14px;">${place.formatted_address || place.vicinity || "No address available"}</p>
          ${place.rating ? `<p style="margin: 5px 0; font-size: 14px;">Rating: ${place.rating} ⭐</p>` : ''}
          <div style="margin-top: 10px;">
            <button 
              style="background-color: #166534; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; margin-right: 8px; display: flex; align-items: center;"
              onclick="window.getDirections('${place.place_id}', 'DRIVING')"
            >
              <span style="margin-right: 5px;">🚗</span> Drive
            </button>
            <button 
              style="background-color: #166534; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; display: flex; align-items: center;"
              onclick="window.getDirections('${place.place_id}', 'WALKING')"
            >
              <span style="margin-right: 5px;">🚶</span> Walk
            </button>
          </div>
        </div>
      `;
      
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent,
        maxWidth: 320
      });
      
      infoWindows.current.push(infoWindow);

      marker.addListener('click', () => {
        // Close all other info windows
        infoWindows.current.forEach(window => {
          if (window !== infoWindow) window.close();
        });
        
        infoWindow.open(map.current, marker);
      });

      // Store place data with marker for routing
      marker.placeData = place;
      
      setMarkers(prevMarkers => [...prevMarkers, marker]);
      return marker;
    } catch (error) {
      console.error('Error creating marker:', error);
      return null;
    }
  }, []);

  const getDirections = useCallback((placeId, mode) => {
    if (!directionsService.current || !directionsRenderer.current || !map.current) {
      console.error('Directions service not initialized');
      return;
    }

    setActivePanel('directions');
    setRouteMode(mode);
    
    // Find the user's location
    if (navigator.geolocation) {
      setStatus("Getting your location...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Set up request
          const request = {
            origin: origin,
            destination: { placeId: placeId },
            travelMode: google.maps.TravelMode[mode],
            provideRouteAlternatives: true
          };
          
          setStatus(`Calculating ${mode.toLowerCase()} directions...`);
          
          // Get directions
          directionsService.current.route(request, (result, status) => {
            if (status === 'OK') {
              directionsRenderer.current.setDirections(result);
              setSelectedRoute(result);
              
              // Extract route information
              const route = result.routes[0];
              if (route && route.legs && route.legs[0]) {
                const leg = route.legs[0];
                setRouteInfo({
                  distance: leg.distance.text,
                  duration: leg.duration.text,
                  startAddress: leg.start_address,
                  endAddress: leg.end_address,
                  steps: leg.steps,
                  alternatives: result.routes.map(route => ({
                    distance: route.legs[0].distance.text,
                    duration: route.legs[0].duration.text,
                    summary: route.summary
                  }))
                });
                
                // Update origin input field with current location
                if (originInputRef.current) {
                  originInputRef.current.value = leg.start_address;
                }
                
                // Update destination input field with destination
                if (destinationInputRef.current) {
                  destinationInputRef.current.value = leg.end_address;
                }
              }
              
              setStatus(`Route calculated. ${mode === 'DRIVING' ? 'Driving' : 'Walking'} distance: ${route.legs[0].distance.text}`);
            } else {
              setStatus(`Could not calculate directions: ${status}`);
            }
          });
        },
        (error) => {
          setStatus(`Error getting your location: ${error.message}`);
        }
      );
    } else {
      setStatus("Geolocation is not supported by your browser");
    }
  }, []);

  const calculateDirections = useCallback(() => {
    if (!directionsService.current || !directionsRenderer.current || !map.current) {
      console.error('Directions service not initialized');
      return;
    }
    
    const origin = originInputRef.current.value;
    const destination = destinationInputRef.current.value;
    
    if (!origin || !destination) {
      setStatus("Please enter both origin and destination");
      return;
    }
    
    setStatus(`Calculating ${routeMode.toLowerCase()} directions...`);
    
    // Set up request
    const request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode[routeMode],
      provideRouteAlternatives: true
    };
    
    // Get directions
    directionsService.current.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.current.setDirections(result);
        setSelectedRoute(result);
        
        // Extract route information
        const route = result.routes[0];
        if (route && route.legs && route.legs[0]) {
          const leg = route.legs[0];
          setRouteInfo({
            distance: leg.distance.text,
            duration: leg.duration.text,
            startAddress: leg.start_address,
            endAddress: leg.end_address,
            steps: leg.steps,
            alternatives: result.routes.map(route => ({
              distance: route.legs[0].distance.text,
              duration: route.legs[0].duration.text,
              summary: route.summary
            }))
          });
        }
        
        setStatus(`Route calculated. ${routeMode === 'DRIVING' ? 'Driving' : 'Walking'} distance: ${route.legs[0].distance.text}`);
      } else {
        setStatus(`Could not calculate directions: ${status}`);
      }
    });
  }, [routeMode]);

  const swapLocations = useCallback(() => {
    if (originInputRef.current && destinationInputRef.current) {
      const temp = originInputRef.current.value;
      originInputRef.current.value = destinationInputRef.current.value;
      destinationInputRef.current.value = temp;
      
      // Recalculate route if both fields have values
      if (originInputRef.current.value && destinationInputRef.current.value) {
        calculateDirections();
      }
    }
  }, [calculateDirections]);

  const changeRouteMode = useCallback((mode) => {
    setRouteMode(mode);
    
    // Recalculate route if already have origin and destination
    if (originInputRef.current && destinationInputRef.current && 
        originInputRef.current.value && destinationInputRef.current.value) {
      setTimeout(() => calculateDirections(), 100);
    }
  }, [calculateDirections]);

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
        
        const createdMarkers = results.map(result => createMarker(result)).filter(Boolean);
        
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

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      filterPlacesByText(searchQuery);
    }
  }, [searchQuery, filterPlacesByText]);

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
        featureType: "poi",
        elementType: "labels.text",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "transit",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }]
      }
    ];
    
    try {
      map.current = new google.maps.Map(mapRef.current, {
        center: losAngeles,
        zoom: 12,
        styles: mapStyles,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'greedy'
      });
      
      service.current = new google.maps.places.PlacesService(map.current);
      directionsService.current = new google.maps.DirectionsService();
      directionsRenderer.current = new google.maps.DirectionsRenderer({
        map: map.current,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#166534', // Green color for routes
          strokeWeight: 5,
          strokeOpacity: 0.7
        }
      });
      
      // Add search box autocomplete
      if (searchBoxRef.current) {
        const searchBox = new google.maps.places.Autocomplete(searchBoxRef.current, {
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'us' }
        });
        
        searchBox.addListener('place_changed', () => {
          const place = searchBox.getPlace();
          if (place.geometry) {
            map.current.setCenter(place.geometry.location);
            map.current.setZoom(15);
            createMarker(place);
            setSearchQuery(place.name);
          }
        });
      }
      
      // Add origin autocomplete
      if (originInputRef.current) {
        const originAutocomplete = new google.maps.places.Autocomplete(originInputRef.current, {
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'us' }
        });
      }
      
      // Add destination autocomplete
      if (destinationInputRef.current) {
        const destAutocomplete = new google.maps.places.Autocomplete(destinationInputRef.current, {
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'us' }
        });
      }
      
      // Add the getDirections function to the window object to make it accessible from infoWindow
      window.getDirections = getDirections;
      
      setIsGoogleMapsLoaded(true);
      setStatus("Map loaded. Search for locations or use the resource filters.");
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      setStatus("Error loading map");
    }
  }, [getDirections, createMarker]);

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
      
      // Get the API key from environment variables
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('GOOGLE_MAPS_API_KEY is not defined in environment variables');
        setStatus("Error: Maps API configuration issue");
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
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
      
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
      }
    };
  }, [initMap, markers]);

  return (
    <div className="flex h-screen flex-col">
      {/* Top search bar - Google Maps style */}
      <div className="flex items-center p-4 bg-white shadow-md z-10">
        <Link href="/landingpage" className="flex items-center mr-4 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 bg-green-800 flex items-center justify-center text-white rounded-sm mr-2">
            <span>CM</span>
          </div>
          <span className="text-green-800 font-semibold text-lg">CityMeet</span>
        </Link>
        
        <form onSubmit={handleSearch} className="flex-grow flex">
          <div className="relative flex-grow">
            <input
              ref={searchBoxRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for resources, locations..."
              className="w-full py-2 pl-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
      
      <div className="flex flex-1 relative">
        {/* Map container */}
        <div ref={mapRef} className="flex-grow h-full" />
        
        {/* Sidebar panel */}
        <div className={`absolute top-0 left-0 h-full w-full md:w-96 transition-transform transform ${activePanel === 'map' ? '-translate-x-full md:translate-x-0 md:opacity-100 opacity-0' : 'translate-x-0 opacity-100'} bg-white shadow-lg z-20 overflow-auto flex flex-col`}>
          {/* Panel controls */}
          <div className="flex justify-between items-center p-4 border-b">
            <button 
              onClick={() => setActivePanel('map')}
              className="md:hidden flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to map
            </button>
            <h2 className="text-lg font-medium text-gray-900">
              {activePanel === 'directions' ? 'Directions' : 'Resource Filters'}
            </h2>
            <div className="w-5"></div> {/* Spacer for alignment */}
          </div>
          
          {/* Panel content */}
          {activePanel === 'directions' ? (
            <div className="flex-1 p-4 overflow-auto">
              {/* Directions panel */}
              <div className="mb-4">
                <div className="relative mb-3">
                  <input
                    ref={originInputRef}
                    type="text"
                    placeholder="Starting point"
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-2.5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="flex justify-center -my-1">
                  <button 
                    onClick={swapLocations}
                    className="p-1 bg-gray-100 rounded-full border border-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>
                
                <div className="relative mt-2 mb-3">
                  <input
                    ref={destinationInputRef}
                    type="text"
                    placeholder="Destination"
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-2.5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Travel mode toggles */}
              <div className="flex mb-4 shadow-sm">
                <button
                  onClick={() => changeRouteMode('DRIVING')}
                  className={`flex-1 py-2 px-4 flex justify-center items-center ${routeMode === 'DRIVING' ? 'bg-green-100 text-green-800 border-b-2 border-green-700' : 'bg-white text-gray-700'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                  </svg>
                  Drive
                </button>
                <button
                  onClick={() => changeRouteMode('WALKING')}
                  className={`flex-1 py-2 px-4 flex justify-center items-center ${routeMode === 'WALKING' ? 'bg-green-100 text-green-800 border-b-2 border-green-700' : 'bg-white text-gray-700'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v1.586l-2.707 2.707A1 1 0 006 8.586V14a1 1 0 102 0v-4.586l2.707-2.707A1 1 0 0011 6V4a1 1 0 00-1-1zm0 10.5a.5.5 0 01.5.5.5.5 0 01-.5.5.5.5 0 01-.5-.5.5.5 0 01.5-.5z" clipRule="evenodd" />
                  </svg>
                  Walk
                </button>
              </div>
              
              <button
                onClick={calculateDirections}
                className="w-full py-2 bg-green-700 text-white rounded-md hover:bg-green-800 mb-4"
              >
                Get Directions
              </button>
              
              {/* Route information */}
              {routeInfo && (
                <div className="mb-4">
                  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-2">
                    <div>
                      <div className="text-lg font-medium">{routeInfo.duration}</div>
                      <div className="text-sm text-gray-600">{routeInfo.distance}</div>
                    </div>
                    <div className="text-sm text-right">
                      {routeMode === 'DRIVING' ? 'Fastest route' : 'Walking route'}
                    </div>
                  </div>
                  
                  {/* Alternative routes */}
                  {routeInfo.alternatives && routeInfo.alternatives.length > 1 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2 text-gray-700">Alternative routes:</h3>
                      {routeInfo.alternatives.slice(1).map((alt, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded-md mb-2 text-sm flex justify-between">
                          <div>
                            <div>{alt.duration}</div>
                            <div className="text-gray-600">{alt.distance}</div>
                          </div>
                          <div className="text-gray-600">{alt.summary || 'Alternative route'}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Route steps */}
                  {routeInfo.steps && (
                    <div className="border-t pt-3 mt-3">
                      <h3 className="font-medium mb-2">Directions:</h3>
                      <div className="space-y-3">
                        {routeInfo.steps.map((step, index) => (
                          <div key={index} className="flex">
                            <div className="mr-3 mt-1">
                              <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-medium text-xs">
                                {index + 1}
                              </div>
                              {index < routeInfo.steps.length - 1 && (
                                <div className="h-full w-0.5 bg-gray-300 mx-auto mt-1"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div dangerouslySetInnerHTML={{ __html: step.instructions }} />
                              <div className="text-xs text-gray-600 mt-1">{step.distance.text} - {step.duration.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (<div className="flex-1 p-4 overflow-auto">
            {/* Resource filters */}
            <div className="space-y-3 mb-6">
              <button 
                className={`w-full py-3 px-4 ${isGoogleMapsLoaded ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400'} text-white font-medium rounded-md flex items-center justify-center transition`}
                onClick={() => {
                  console.log('Homeless Shelters button clicked');
                  filterPlacesByText('homeless shelters in Los Angeles');
                }}
                disabled={!isGoogleMapsLoaded}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
                Homeless Shelters
              </button>
              
              <button 
                className={`w-full py-3 px-4 ${isGoogleMapsLoaded ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400'} text-white font-medium rounded-md flex items-center justify-center transition`}
                onClick={() => {
                  console.log('Food Centers button clicked');
                  filterPlacesByText('food banks in Los Angeles');
                }}
                disabled={!isGoogleMapsLoaded}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892A1 1 0 006 12h7a1 1 0 000-2H7.414l.893-.892L9.525 6h2.473a1 1 0 00.986-.832l.682-3.41a1 1 0 00-.984-1.168H3z" />
                  <path d="M12 13a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Food Centers
              </button>
              
              <button 
                className={`w-full py-3 px-4 ${isGoogleMapsLoaded ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400'} text-white font-medium rounded-md flex items-center justify-center transition`}
                onClick={() => {
                  console.log('Medical Services button clicked');
                  filterPlacesByType('hospital');
                }}
                disabled={!isGoogleMapsLoaded}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h8a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4 1a1 1 0 10-2 0v2a1 1 0 102 0V7zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V7zm4 0a1 1 0 10-2 0v2a1 1 0 102 0V7z" clipRule="evenodd" />
                </svg>
                Medical Services
              </button>
              
              <button 
                className={`w-full py-3 px-4 ${isGoogleMapsLoaded ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400'} text-white font-medium rounded-md flex items-center justify-center transition`}
                onClick={() => {
                  console.log('Employment Services button clicked');
                  filterPlacesByText('employment services in Los Angeles');
                }}
                disabled={!isGoogleMapsLoaded}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
                Employment Services
              </button>
              
              <button 
                className={`w-full py-3 px-4 ${isGoogleMapsLoaded ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'} text-white font-medium rounded-md flex items-center justify-center transition`}
                onClick={() => {
                  setActivePanel('directions');
                  // Try to get user location for origin
                  if (navigator.geolocation && originInputRef.current) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const geocoder = new google.maps.Geocoder();
                        geocoder.geocode(
                          { location: { lat: position.coords.latitude, lng: position.coords.longitude } },
                          (results, status) => {
                            if (status === 'OK' && results[0]) {
                              originInputRef.current.value = results[0].formatted_address;
                            } else {
                              originInputRef.current.value = "My location";
                            }
                          }
                        );
                      },
                      (error) => {
                        console.error('Error getting location: ', error);
                      }
                    );
                  }
                }}
                disabled={!isGoogleMapsLoaded}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Get Directions
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="text-lg font-medium mb-3 text-green-700">Information</h3>
              <p className="text-gray-700 mb-2">
                This map shows welfare resources and community services available in Los Angeles. Use the buttons above to filter for specific services.
              </p>
              <p className="text-sm text-gray-600">
                Status: {status}
              </p>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3 text-green-700">How to Use</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Click on the resource buttons to find services in your area</li>
                <li>Click on any marker to see details about that location</li>
                <li>Use the search bar to find specific locations</li>
                <li>Click "Get Directions" to plan your route</li>
                <li>Click on "Drive" or "Walk" in location info windows for quick directions</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile-only floating action buttons */}
      {activePanel === 'map' && (
        <div className="md:hidden absolute bottom-6 right-6 flex flex-col space-y-3">
          <button 
            onClick={() => setActivePanel('directions')}
            className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>
          
          <button 
            onClick={() => window.location.href = '#filters'}
            className="h-14 w-14 rounded-full bg-green-700 text-white flex items-center justify-center shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      )}
    </div>
    
    {/* Status bar - only visible when certain actions are happening */}
    {status && status !== "Map loaded. Search for locations or use the resource filters." && (
      <div className="fixed bottom-0 left-0 right-0 bg-white py-2 px-4 shadow-md text-sm text-gray-700 flex items-center z-30">
        <div className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        {status}
      </div>
    )}
  </div>
);
}