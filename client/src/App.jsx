import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage.jsx';
import DataPage from './components/DataPage/DataPage.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/:dynamicPath" element={<DataPage />} /> 
        {/* <Route path="/DataPage" element={<DataPage />} />  */}

      </Routes>
    </Router>
  );
}

export default App;
