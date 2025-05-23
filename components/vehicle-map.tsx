"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { ZoomIn, ZoomOut, Car, X } from 'lucide-react'

// Dynamically import the Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">地図を読み込み中...</p>
    </div>
  ),
})

// Fixed vehicle data for Utase Community Center
const getVehicleData = () => {
  // Convert from DMS to decimal degrees
  // 35°38'21.7"N 140°02'47.5"E
  const lat = 35.6393611 // 35 + (38/60) + (21.7/3600)
  const lng = 140.0465278 // 140 + (2/60) + (47.5/3600)

  return [
    {
      id: "vehicle-1",
      position: [lat, lng],
      name: "ベイ太くん",
      heading: 337.5, // Heading in degrees (337.5 = North-Northwest)
      batteryLevel: 85, // Added back battery level
    },
  ]
}

export default function VehicleMap() {
  const [zoom, setZoom] = useState(16)
  const [vehicles, setVehicles] = useState([])
  const [center, setCenter] = useState([35.6393611, 140.0465278]) // Utase Community Center
  const [showVehicleDetails, setShowVehicleDetails] = useState(false)

  useEffect(() => {
    // Set fixed vehicle data
    setVehicles(getVehicleData())
  }, [])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 13))
  }

  const toggleVehicleDetails = () => {
    setShowVehicleDetails(!showVehicleDetails)
  }

  return (
    <div className="relative w-full h-full">
      <Map center={center} zoom={zoom} vehicles={vehicles} />

      {/* Zoom controls */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-[1000]">
        <button 
          onClick={handleZoomIn}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 bg-white hover:bg-gray-100 text-gray-900 shadow-lg h-10 w-10"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 bg-white hover:bg-gray-100 text-gray-900 shadow-lg h-10 w-10"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
      </div>

      {/* Vehicle button */}
      <div className="absolute bottom-6 left-4 z-[1000]">
        <button
          onClick={toggleVehicleDetails}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 bg-white hover:bg-gray-100 text-gray-900 shadow-lg h-12 w-12"
        >
          <Car className="h-6 w-6 text-blue-600" />
        </button>
      </div>

      {/* Vehicle details panel */}
      {showVehicleDetails && vehicles.length > 0 && (
        <div className="absolute bottom-20 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] w-64">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{vehicles[0].name}</h3>
            <button 
              onClick={toggleVehicleDetails}
              className="inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-6 w-6"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">バッテリー残量:</span>
              <span className="font-medium text-green-600">{vehicles[0].batteryLevel}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${vehicles[0].batteryLevel}%` }}></div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">現在位置:</span>
              <span className="font-medium">打瀬公民館前</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">座標:</span>
              <span className="font-medium text-xs">
                {vehicles[0].position[0].toFixed(4)}, {vehicles[0].position[1].toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ステータス:</span>
              <span className="font-medium text-blue-600">走行中</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
