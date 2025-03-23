# Garden Planner Web App

A web application for planning and visualizing garden designs by placing plants on uploaded garden photos.

## Features

- Upload garden photos and set dimensions
- Browse and search for plants
- Set garden scale with reference objects
- Drag and drop plants onto your garden
- Visualize plants at different growth stages
- Save and manage garden designs in your browser
- Responsive design for desktop and mobile devices
- Interactive plant placement with previews
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
│   ├── molecules/       # Combinations of atoms (PlantCard, DraggablePlant, etc.)
│   ├── organisms/       # Complex components (Header, GardenCanvas, etc.)
│   ├── templates/       # Page layouts (MainLayout)
│   └── pages/           # Complete pages (HomePage, GardenEditorPage, etc.)
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
5. ✅ Plant selection interface
6. ✅ Plant placement system
7. ✅ Growth visualization
8. ✅ Mobile responsiveness
9. ✅ Final polish and optimizations
10. ❌ Garden plan saving

## Key Features

### Plant Database
- Comprehensive database of plants with detailed information
- Filtering by plant type, sun exposure, water needs, and size
- Visual representations of plants at different growth stages

### Garden Photo Upload
- Simple drag-and-drop photo upload
- Automatic image optimization
- Mobile camera support for taking garden photos

### Scaling System
- Reference object placement to accurately scale plants
- Real-world to pixel conversion for realistic plant sizing
- Dynamic scale adjustments based on garden dimensions

### Plant Placement
- Intuitive drag-and-drop plant placement
- Plant rotation and resizing
- Visual preview during placement
- Touch support for mobile devices

### Growth Visualization
- Time slider to view garden at different points in time
- Shows plants at initial planting, 3 years, 5 years, and mature sizes
- Realistic growth modeling based on plant data

### Mobile Experience
- Responsive design that works on devices from 320px width
- Touch-optimized controls
- Simplified interface for smaller screens
- Optimized workflows for mobile users

### Performance Optimizations
- Code splitting and lazy loading for faster initial load
- Optimized rendering for smooth interactions
- Efficient state management
- Progressive loading for images

### User Experience Enhancements
- Toast notifications for user feedback
- Confirmation dialogs for important actions
- Error handling with helpful recovery options
- Loading states and transitions

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Support

- Minimum screen width: 320px
- Touch-friendly interface with elements at least 44px × 44px
- Optimized for both portrait and landscape orientations

## License

This project is licensed under the MIT License - see the LICENSE file for details.
