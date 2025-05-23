import VehicleMap from "@/components/vehicle-map"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-screen">
        <VehicleMap />
      </div>
    </main>
  )
}
