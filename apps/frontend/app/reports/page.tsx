import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold">Survey Reporting Portal</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Survey Summaries</CardTitle>
          <CardDescription>Comprehensive summaries of recent surveys.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>List of survey reports will be displayed here.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Individual Flight Statistics</CardTitle>
          <CardDescription>Detailed stats for a selected flight.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Duration:</strong> 42 minutes</p>
          <p><strong>Distance Covered:</strong> 15 km</p>
          <p><strong>Area Coverage:</strong> 30 hectares</p>
        </CardContent>
      </Card>
    </div>
  );
} 