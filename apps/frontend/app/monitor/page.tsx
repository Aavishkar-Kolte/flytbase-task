import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MonitorPage() {
  return (
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-4">Real-time Mission Monitoring</h1>
        <Card>
          <CardHeader>
            <CardTitle>Live Mission Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[60vh] bg-gray-200 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Real-time drone flight paths will be visualized here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Mission Status & Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Mission: Survey-Alpha-123</h3>
              <p className="text-sm text-gray-500">Status: In Progress</p>
              <p className="text-sm text-gray-500">Progress: 75% complete</p>
              <p className="text-sm text-gray-500">ETR: 12 minutes</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Pause</Button>
              <Button variant="outline">Resume</Button>
              <Button variant="destructive">Abort</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 