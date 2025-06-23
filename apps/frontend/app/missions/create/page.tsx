import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateMissionPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold">Plan New Mission</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Define Survey Area</CardTitle>
          <CardDescription>Define the geographical area for the survey.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for a map component */}
          <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Map for defining flight paths and waypoints will be here.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flight Configuration</CardTitle>
          <CardDescription>Configure flight paths, altitudes, and waypoints.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="altitude">Flight Altitude (meters)</Label>
            <Input id="altitude" placeholder="e.g., 100" />
          </div>
          {/* Add more inputs for waypoints etc. */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Collection Parameters</CardTitle>
          <CardDescription>Set parameters like collection frequency and sensors to use.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="frequency">Data Collection Frequency (Hz)</Label>
            <Input id="frequency" placeholder="e.g., 10" />
          </div>
          <div className="grid gap-2">
            <Label>Sensors to use</Label>
            {/* Placeholder for sensor selection checkboxes */}
            <p className="text-sm text-gray-500">Sensor selection options will be here.</p>
          </div>
        </CardContent>
      </Card>

      <Button>Create Mission</Button>
    </div>
  );
} 