# Sohar Port Digital Twin - MVP

A stunning 3D visualization platform for Sohar Industrial Port in Oman, featuring real-time energy monitoring and predictive analytics for 280+ companies.

## 🚀 Features

### Core Functionality

#### 🚢 Complete Port Infrastructure
- **4 Docked Ships**: Container ships, oil tankers, and bulk carriers at berths
- **3 STS Cranes**: Ship-to-Shore cranes for loading/unloading (orange)
- **4 RTG Cranes**: Rubber Tyred Gantry cranes for container yard operations (blue)
- **11+ Container Stack Yards**: Thousands of colorful containers organized in rows
- **5 Warehouses/Buildings**: Industrial storage and processing facilities
- **Road Network**: Multi-lane roads connecting all port areas
- **7+ Moving Trucks**: Animated trucks transporting cargo throughout the port
- **Port Control Tower**: Tall control tower with radar for port operations
- **15 Lighting Poles**: Port lighting along berths for night operations
- **Fuel Station**: Refueling area for port vehicles
- **Security Gates**: Entry/exit control points

#### 📊 Live Energy Monitoring
- **Real-time Data**: Simulated power consumption for 12 major companies
- **Color-Coded Status Indicators**: 
  - 🟢 Green (0-70%): Normal operation
  - 🟡 Yellow (70-85%): Medium load
  - 🔴 Red (85-100%): High load/alert
  - ⚫ Gray: Idle/offline

#### 🎮 Interactive Features
- **Click any equipment**: Ships, cranes, containers, warehouses show detailed info
- **Rotating camera**: Drag to rotate view around the entire port
- **Zoom**: Scroll to zoom in/out for detailed inspection
- **Animated trucks**: Watch trucks moving cargo along roads in real-time
- **Ship lighting**: Navigation lights (red/green) on all vessels
- **Status lights**: Glowing indicators on all equipment showing operational status

#### ⏱️ Time Controls
- Play/pause simulation
- Adjust speed (1x, 5x, 10x)
- Jump forward (+6h, +24h)

#### 🤖 AI Predictions
- Machine learning-powered forecasts
- Load predictions and recommendations
- Anomaly detection alerts

#### 📈 Real-time Dashboard
- Live power metrics
- Interactive charts
- Company performance table
- Active alerts panel

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **3D Graphics**: Three.js + @react-three/fiber + @react-three/drei
- **Charts**: Recharts
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Installation

```bash
# Navigate to project directory
cd sohar-digital-twin

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
sohar-digital-twin/
├── src/
│   ├── components/
│   │   ├── DigitalTwin/          # 3D visualization components
│   │   │   ├── PortScene.tsx
│   │   │   ├── PortModel.tsx
│   │   │   ├── STSCrane.tsx
│   │   │   ├── RTGCrane.tsx
│   │   │   ├── ContainerStacks.tsx
│   │   │   └── InteractionPanel.tsx
│   │   │
│   │   ├── Dashboard/            # Dashboard components
│   │   │   ├── LiveMetrics.tsx
│   │   │   ├── EnergyChart.tsx
│   │   │   ├── CompanyTable.tsx
│   │   │   └── AlertsPanel.tsx
│   │   │
│   │   ├── Analytics/            # AI predictions
│   │   │   └── PredictionsView.tsx
│   │   │
│   │   └── UI/                   # Reusable UI components
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── TimeControl.tsx
│   │       └── LoadingScreen.tsx
│   │
│   ├── data/                     # Mock data & simulators
│   │   ├── companies.ts
│   │   ├── portLayout.ts
│   │   ├── namaApiSimulator.ts
│   │   └── predictions.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── useRealTimeData.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── statusColors.ts
│   │   ├── calculations.ts
│   │   └── formatters.ts
│   │
│   └── types/                    # TypeScript types
│       └── index.ts
```

## 🎮 Usage

### Navigation
- **Mouse**: Rotate camera by dragging
- **Scroll**: Zoom in/out
- **Click**: Select equipment to view details

### Time Controls
- **Play/Pause**: Start or stop the simulation
- **Speed**: Adjust simulation speed (1x, 5x, 10x)
- **Jump**: Fast-forward +6 hours or +24 hours

### Data Simulation
The system simulates:
- Peak hours (8am-6pm): 30% higher consumption
- Off-peak hours (6pm-8am): 15% lower consumption
- Random variance: ±10%
- Occasional alerts for high-load scenarios

## 📊 Key Metrics

- **Total Power Capacity**: 585 MW
- **Monitored Companies**: 12 major industrial companies
- **Equipment**: 3 STS Cranes, 4 RTG Cranes, 4 Container Stacks
- **Update Interval**: Every 5 seconds
- **Historical Data**: Last 24 hours

## 🏢 Major Companies (Mock Data)

1. **Sohar Aluminum** - 145 MW (High Criticality)
2. **Jindal Shadeed Iron & Steel** - 112 MW (High Criticality)
3. **Vale Oman Pelletizing** - 90 MW (High Criticality)
4. **Sohar Power Company** - 52 MW (High Criticality)
5. **Oman Refineries Company** - 45 MW (Medium Criticality)
6. Plus 7 more companies

## 🎯 Future Enhancements

- Integration with real Nama API for actual energy data
- Expand to full 280+ companies
- Historical data analysis and reporting
- User authentication and role-based access
- Advanced AI/ML models for predictive maintenance
- Mobile responsiveness
- Export functionality for reports

## 🤝 Credits

Developed for the Sohar Port hackathon - demonstrating the potential of Digital Twin technology for industrial port operations.

## 📄 License

This is an MVP demonstration prototype.
