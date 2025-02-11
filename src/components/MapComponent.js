import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import temperatureData from "../output_data/temperature_points.geojson"; // check the path

const MapComponent = () => {
  const mapRef = useRef(null); // Store the map instance
  const mapContainerRef = useRef(null); // Store reference to the DOM element

  useEffect(() => {
    // Only initialize the map if the container div is available
    if (mapContainerRef.current && !mapRef.current) {
      // Initialize the map only once
      mapRef.current = L.map(mapContainerRef.current).setView(
        [37.1773, -3.5986],
        13
      ); // Centered on Granada

      // OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Extract heatmap points from GeoJSON
    const heatPoints = temperatureData.features.map((feature) => {
      return [
        feature.geometry.coordinates[1], // Latitude
        feature.geometry.coordinates[0], // Longitude
        feature.properties.temperature || 1, // Intensity (default to 1 if missing)
      ];
    });

    // Add heat layer to the map (only if data exists)
    if (mapRef.current) {
      L.heatLayer(heatPoints, {
        radius: 20, // Adjust this for the spread of the heat
        blur: 15, // Adjust this for smoothness
        maxZoom: 17, // Heatmap will adjust with zoom levels
      }).addTo(mapRef.current);
    }

    // Cleanup function when the component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // Clean up the map instance
        mapRef.current = null; // Set it to null to avoid re-initializing
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }}></div>
  );
};

export default MapComponent;
