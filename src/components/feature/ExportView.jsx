import React, { useEffect, useRef, useState, useContext } from 'react';
import { Visualization } from './Visualization';
import { ScaleContext } from '../context';

const ExportVisualization = () => {
  const containerRef = useRef(null);
  const { setMin, setMax, setScale, setHeight, setHlChromosome, setHlRanges } = useContext(ScaleContext);

  const [activeVisualizationTracks, setActiveVisualizationTracks] = useState([]);
  const [position, setPosition] = useState({
    chromosome: 'chr8',
    start: '127735433',
    end: '127742951'
  });

  useEffect(() => {
    const getData = async () => {
      try {
        // Load tracks and position data
        const storedTracks = JSON.parse(localStorage.getItem('EXPORT_TRACKS')) || [];
        const storedPosition = JSON.parse(localStorage.getItem('EXPORT_POSITION')) || {};
        const storedHighlight = JSON.parse(localStorage.getItem('EXPORT_HIGHLIGHT')) || {};
        const storedScale = JSON.parse(localStorage.getItem('EXPORT_SCALE')) || {};

        // Update context with scale values from localStorage
        if (storedScale) {
          setHeight(storedScale.height);
          setMin(storedScale.min);
          setMax(storedScale.max);
          setScale(storedScale.scale);
        }

        if (storedHighlight) {
          setHlChromosome(storedHighlight.chr)
          setHlRanges(storedHighlight.ranges)
        }

        // Set component state
        setActiveVisualizationTracks(storedTracks);
        setPosition({
          chromosome: storedPosition.chromosome || 'chr8',
          start: storedPosition.start || '127735433',
          end: storedPosition.end || '127742951'
        });


      } catch (err) {
        console.error('Failed to load export state:', err);
      }
    }
    getData()
  }, []);

  return (
    <div className="p-6">
      <div className='text-xl font-semibold'>ProteinPaint Export</div>
      <Visualization
        activeVisualizationTracks={activeVisualizationTracks}
        containerRef={containerRef}
        changeMode={false}
        definePosition={position}
        exportState={false}
      />
    </div>
  );
};

export default ExportVisualization;