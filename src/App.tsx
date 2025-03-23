import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  HomePage, 
  PlantBrowserPage,
  GardenUploadPage,
  GardenEditorPage
} from './components/pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plants" element={<PlantBrowserPage />} />
        <Route path="/garden/new" element={<GardenUploadPage />} />
        <Route path="/garden/:gardenId" element={<GardenEditorPage />} />
        <Route path="/garden" element={<Navigate replace to="/garden/new" />} />
      </Routes>
    </Router>
  );
}

export default App;