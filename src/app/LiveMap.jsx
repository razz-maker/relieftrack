"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for a known React-Leaflet bug where default marker icons disappear
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// A small helper component to automatically center the map when data changes
function MapBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

export default function LiveMap({ reports, onMarkerClick }) {
  // Center defaults to India if no reports exist
  const defaultCenter = [22.9, 78.9]; 

  return (
    <div style={{ height: "450px", width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border)" }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        style={{ height: "100%", width: "100%", background: "#0a0908" }}
      >
        {/* Dark Mode Map Tiles from CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.lat, report.lng]}
            eventHandlers={{
              click: () => onMarkerClick(report.id),
            }}
          >
            <Popup>
              <div style={{ fontFamily: "var(--font-display)", color: "#000" }}>
                <div style={{ fontSize: "11px", fontWeight: "bold", color: "#ff4444", marginBottom: "4px" }}>
                  {report.id}
                </div>
                <div style={{ fontWeight: "700", marginBottom: "4px" }}>
                  {report.title}
                </div>
                <div style={{ fontSize: "12px" }}>
                  {report.category} • {report.priority} Priority
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapBounds markers={reports} />
      </MapContainer>
    </div>
  );
}