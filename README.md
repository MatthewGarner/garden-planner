# Garden Planner Web App

A web application for planning and visualizing garden designs by placing plants on uploaded garden photos.

## Features

- Upload garden photos and set dimensions
- Browse and search for plants
- Set garden scale with reference objects
- Drag and drop plants onto your garden
- Visualize plants at different growth stages
- Save and manage garden designs in your browser
- Export garden plans as images

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/garden-planner.git
cd garden-planner
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Project Structure

```
src/
├── components/          # React components using atomic design
│   ├── atoms/           # Basic building blocks (Button, etc.)
│   ├── molecules/       # Combinations of atoms (PlantCard, FileUpload, ReferenceObject, etc.)
│   ├── organisms/       # Complex components (Header, PlantGallery, GardenUpload, etc.)
│   ├── templates/       # Page layouts (MainLayout)
│   └── pages/           # Complete pages (HomePage, PlantBrowserPage, GardenScalingPage, etc.)
├── hooks/               # Custom React hooks
├── services/            # Services for data operations
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── assets/              # Static assets
├── data/                # Mock data (plants.json)
└── App.tsx              # Main application component
```

## Development Roadmap

1. ✅ Project setup and initial structure
2. ✅ Plant database implementation 
3. ✅ Garden photo upload functionality
4. ✅ Garden scaling system
5. ❌ Plant selection interface
6. ❌ Plant placement system
7. ❌ Growth visualization
8. ❌ Garden plan saving
9. ❌ Mobile responsiveness
10. ❌ Final polish and optimizations

## Current Progress

The project now has:

- Working plant database with filtering and detailed information
- Complete garden photo upload flow:
  - Drag-and-drop file upload with validation
  - Garden dimension configuration
  - Garden creation and naming
- Garden scaling system:
  - Reference object placement for accurate scaling
  - Conversion between pixels and real-world dimensions
  - Scale calculation based on reference objects
- Navigation between pages
- Local storage for saving garden data

The next step will focus on implementing the plant selection interface and plant placement functionality.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Support

- Minimum screen width: 320px
- Touch-friendly interface

## License

This project is licensed under the MIT License - see the LICENSE file for details.