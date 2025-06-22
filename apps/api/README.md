# Drone Management API

A comprehensive REST API for managing drone fleets, missions, and telemetry data built with Express.js and TypeORM.

## Features

- **Drone Management**: CRUD operations for drones with fleet associations
- **Mission Management**: Create and manage inspection, mapping, and security missions
- **Fleet Management**: Organize drones into fleets
- **Site Management**: Manage operational sites
- **Telemetry Data**: Real-time drone telemetry collection and retrieval
- **Mission Progress**: Track mission execution progress
- **Statistics**: Analytics on drone and mission status

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Environment variables configured

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create a `.env` file):
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=drone_management
PORT=3001
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - Check API status

### Drones

#### Get all drones
```
GET /api/drones
```
Returns a list of all drones with their fleet information.

#### Get drone by ID
```
GET /api/drones/:id
```
Returns detailed information about a specific drone including telemetry and mission progress.

#### Create a new drone
```
POST /api/drones
```
Body:
```json
{
  "fleet_id": 1,
  "model": "DJI Mavic 3",
  "serial_number": "DJI123456789",
  "status": "available",
  "data_frequency": 30,
  "sensors": ["camera", "gps", "altimeter"]
}
```

#### Update drone
```
PUT /api/drones/:id
```
Update an existing drone's information.

#### Delete drone
```
DELETE /api/drones/:id
```
Remove a drone from the system.

#### Get drone telemetry
```
GET /api/drones/:id/telemetry?limit=100
```
Retrieve telemetry data for a specific drone.

#### Add telemetry data
```
POST /api/drones/:id/telemetry
```
Body:
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "altitude": 100.5,
  "battery_level": 85,
  "speed": 15.2,
  "heading": 180
}
```

### Missions

#### Get all missions
```
GET /api/missions
```
Returns a list of all missions with organization, site, and creator information.

#### Get mission by ID
```
GET /api/missions/:id
```
Returns detailed mission information including routes, reports, and progress.

#### Create a new mission
```
POST /api/missions
```
Body:
```json
{
  "org_id": 1,
  "site_id": 1,
  "created_by": 1,
  "name": "Site Inspection Mission",
  "mission_type": "inspection",
  "pattern": "crosshatch",
  "overlap_percentage": 80,
  "status": "planned"
}
```

#### Update mission
```
PUT /api/missions/:id
```
Update mission details.

#### Delete mission
```
DELETE /api/missions/:id
```
Remove a mission from the system.

#### Get mission progress
```
GET /api/missions/:id/progress
```
Retrieve progress updates for a specific mission.

#### Add mission progress
```
POST /api/missions/:id/progress
```
Body:
```json
{
  "drone_id": 1,
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "in_progress",
  "completion_percentage": 45,
  "current_waypoint": 3,
  "total_waypoints": 10
}
```

### Fleets

#### Get all fleets
```
GET /api/fleets
```
Returns a list of all fleets with their associated drones.

#### Get fleet by ID
```
GET /api/fleets/:id
```
Returns detailed fleet information including all drones.

### Sites

#### Get all sites
```
GET /api/sites
```
Returns a list of all operational sites.

#### Get site by ID
```
GET /api/sites/:id
```
Returns detailed site information including associated missions.

### Statistics

#### Get drone statistics
```
GET /api/stats/drones
```
Returns statistics about drone status distribution.

#### Get mission statistics
```
GET /api/stats/missions
```
Returns statistics about mission status distribution.

## Data Models

### Drone
- `id`: Unique identifier
- `fleet_id`: Associated fleet
- `model`: Drone model name
- `serial_number`: Unique serial number
- `status`: Current status (available, in-mission, maintenance, offline)
- `data_frequency`: Telemetry data frequency in seconds
- `sensors`: Array of sensor types
- `created_at`: Creation timestamp

### Mission
- `id`: Unique identifier
- `org_id`: Organization ID
- `site_id`: Site ID
- `created_by`: User who created the mission
- `name`: Mission name
- `mission_type`: Type (inspection, mapping, security)
- `pattern`: Flight pattern (crosshatch, perimeter, custom)
- `overlap_percentage`: Image overlap percentage
- `status`: Current status (planned, active, paused, completed, aborted)
- `start_time`: Mission start time
- `end_time`: Mission end time
- `created_at`: Creation timestamp

### DroneTelemetry
- `id`: Unique identifier
- `drone_id`: Associated drone
- `timestamp`: Telemetry timestamp
- `latitude`: GPS latitude
- `longitude`: GPS longitude
- `altitude`: Altitude in meters
- `battery_level`: Battery percentage
- `speed`: Speed in m/s
- `heading`: Direction in degrees

### MissionProgress
- `id`: Unique identifier
- `mission_id`: Associated mission
- `drone_id`: Associated drone
- `timestamp`: Progress timestamp
- `status`: Current status
- `completion_percentage`: Mission completion percentage
- `current_waypoint`: Current waypoint number
- `total_waypoints`: Total waypoints in mission

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `204` - No content (for deletions)
- `400` - Bad request
- `404` - Not found
- `500` - Internal server error

Error responses include a descriptive message:
```json
{
  "error": "Failed to fetch drones"
}
```

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Database
The API uses TypeORM with PostgreSQL. Make sure your database is running and migrations are applied.

### Environment Variables
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `PORT` - API server port (default: 3001)

## Security

- CORS enabled for cross-origin requests
- Helmet.js for security headers
- Input validation and sanitization
- Error handling to prevent information leakage

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include appropriate HTTP status codes
4. Document new endpoints
5. Test thoroughly before submitting 