import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DronesPage() {
  // Sample data
  const drones = [
    { id: "Drone-001", status: "available", battery: "98%" },
    { id: "Drone-002", status: "in-mission", battery: "55%" },
    { id: "Drone-003", status: "available", battery: "100%" },
    { id: "Drone-004", status: "maintenance", battery: "N/A" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "in-mission":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Fleet Visualisation and Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Organization-wide Drone Inventory</CardTitle>
          <CardDescription>Real-time status and vitals of all drones in the fleet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drones.map((drone) => (
              <Card key={drone.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {drone.id}
                    <Badge className={`${getStatusColor(drone.status)} text-white`}>{drone.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Battery Level: {drone.battery}</p>
                  {/* Other vital statistics can go here */}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 