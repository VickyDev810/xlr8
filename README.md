# StartupRadar

StartupRadar is a real-time funding data and trends platform for startups across industries. Track investors, funding rounds, and market insights in one place.

## Features

- **Dashboard:** View the latest funding rounds and activity in the startup ecosystem
- **Investor Profiles:** Explore detailed profiles of top investors and their portfolios
- **Trends & Insights:** Analyze funding trends across industries, round types, and time periods
- **Startup Profiles:** Dive deep into individual startup information and funding history

## Tech Stack

- React 18+ with TypeScript
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- Supabase for backend (currently using mock data)
- React Router for navigation
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js (18.x or later recommended)
- npm (9.x or later)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/startup-radar.git
cd startup-radar
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   - Copy the `.env.example` file to `.env`
   - Update the Supabase connection details (optional - mock data is used by default)

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Development

### Building for production
```bash
npm run build
```

### Preview the production build
```bash
npm run preview
```

## Project Structure

- `/src`: Source code
  - `/api`: API services for data fetching
  - `/components`: Reusable UI components
  - `/lib`: Utilities and type definitions
  - `/pages`: Main application pages
- `/public`: Static assets

## License

This project is licensed under the MIT License.
>>>>>>> origin/harsh
