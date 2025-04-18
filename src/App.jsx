import React from 'react'
import Recount from './components/table/Recount3'
import MM10 from './components/table/MM10'
import HG38 from './components/table/HG38'
import HomePage from './components/HomePage'
import ExportVisualization from './components/feature/ExportView'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/recount3" element={<Recount />} />
        <Route path="/mm10" element={<MM10 />} />
        <Route path="/hg38" element={<HG38 />} />
        <Route path="/export" element={<ExportVisualization />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App