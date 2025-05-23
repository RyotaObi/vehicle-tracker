"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet icon issue
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

// Rotated car icon with direction triangle aligned to edge
const createDirectionalCarIcon = (heading) => {
  // Pink color for the vehicle background
  const color = "#ec4899"

  // Create a rotated square icon with car silhouette and direction triangle
  return L.divIcon({
    html: `
      <div style="position: relative; width: 36px; height: 36px;">
        <!-- Rotated Square with Car Icon -->
        <div style="position: absolute; top: 0; left: 0; width: 32px; height: 32px; background-color: ${color}; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transform: rotate(${heading}deg); transform-origin: center center;">
          <!-- Lucide Car Icon (white) -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-2"></path>
              <path d="M5 17H3c-.6 0-1-.4-1-1v-3c0-.6.4-1 1-1h2"></path>
              <path d="M14 9h-4"></path>
              <rect width="16" height="8" x="4" y="9" rx="2"></rect>
              <path d="M5 5l4 4"></path>
              <path d="M19 5l-4 4"></path>
            </svg>
          </div>
          
          <!-- Direction Triangle aligned with edge -->
          <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 10px solid ${color};"></div>
        </div>
      </div>
    `,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

// Create blue circle icon for user location (doubled in size)
const createUserLocationIcon = () => {
  return L.divIcon({
    html: `
      <div style="width: 32px; height: 32px; background-color: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 3px 6px rgba(0,0,0,0.3);"></div>
    `,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

export default function Map({ center, zoom, vehicles }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})
  const userMarkerRef = useRef(null)

  useEffect(() => {
    // Fix Leaflet icon issue
    fixLeafletIcon()

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, { zoomControl: false }).setView(center, zoom)

      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current)

      // Convert from DMS to decimal degrees
      // 35°38'24.1"N 140°02'49.4"E
      const userLat = 35.6400278 // 35 + (38/60) + (24.1/3600)
      const userLng = 140.0470556 // 140 + (2/60) + (49.4/3600)

      // Add user location marker (blue circle) at the specified coordinates
      const userLocationCoords = [userLat, userLng]
      const userIcon = createUserLocationIcon()
      userMarkerRef.current = L.marker(userLocationCoords, { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">現在地</h3>
            <p>35°38'24.1"N 140°02'49.4"E</p>
          </div>
        `)
    } else {
      // Update view if center or zoom changes
      mapInstanceRef.current.setView(center, zoom)
    }

    // Clean up function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update zoom when it changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(zoom)
    }
  }, [zoom])

  // Update vehicle markers
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Remove old markers
    Object.values(markersRef.current).forEach((marker) => {
      marker.remove()
    })

    // Add new markers
    vehicles.forEach((vehicle) => {
      const icon = createDirectionalCarIcon(vehicle.heading)

      const marker = L.marker(vehicle.position, { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${vehicle.name}</h3>
            <p>位置: 打瀬公民館前</p>
            <p>ステータス: <span style="color: #2563eb; font-weight: 500;">走行中</span></p>
          </div>
        `)

      markersRef.current[vehicle.id] = marker
    })
  }, [vehicles])

  return <div ref={mapRef} className="w-full h-full z-10" />
}
