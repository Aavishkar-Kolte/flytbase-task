import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function MissionsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Missions</h1>
        <Button asChild>
          <Link href="/missions/create">Plan New Mission</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Mission List</CardTitle>
          <CardDescription>A list of all planned and executed missions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Mission list will be displayed here.</p>
          {/* Placeholder for mission list table */}
        </CardContent>
      </Card>
    </div>
  );
} 