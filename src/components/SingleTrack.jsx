import React, { useEffect, useRef, useState } from "react";
import { PositionInput } from './feature/PositionInput';
import { BarIcon, CloseIcon } from '../assets/icon';
import HighLightSelector from './feature/HighLightSelector';

export const SingleTrackView = ({ track, onClose }) => {
  const containerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hlChromosome, setHlChromosome] = useState('');
  const [hlRanges, setHlRanges] = useState([]);
  
  // Get position from localStorage
  const [position, setPosition] = useState({
    chromosome: localStorage.getItem('DEFAULT_CHROMOSOME') || 'chr8',
    start: localStorage.getItem('DEFAULT_START') || '127735433',
    end: localStorage.getItem('DEFAULT_END') || '127742951'
  });

  // Update localStorage when position changes
  useEffect(() => {
    localStorage.setItem('DEFAULT_CHROMOSOME', position.chromosome);
    localStorage.setItem('DEFAULT_START', position.start);
    localStorage.setItem('DEFAULT_END', position.end);
  }, [position]);

  // Initialize ProteinPaint
  useEffect(() => {
    if (!track) {
      return;
    }

    if (!isInitialized) {
      const script = document.createElement("script");
      script.src = "https://proteinpaint.stjude.org/bin/proteinpaint.js";
      script.onload = () => {
        setIsInitialized(true);
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else {
      updateProteinPaint();
    }
  }, [track, position, isInitialized, hlRanges, hlChromosome]);

  const updateProteinPaint = async () => {
    if (!containerRef.current || !window.runproteinpaint) return;
  
    // Clear previous visualization
    containerRef.current.innerHTML = '';
  
    // Define highlight regions if any
    const highlights = hlRanges.length > 0 ? 
      hlRanges.map(range => ({
        chr: hlChromosome, 
        start: parseInt(range.start), 
        end: parseInt(range.end),
        color: "#FFCCCC"
      })) : 
      undefined;
      
    // Initialize ProteinPaint with a single track
    const ppInstance = await window.runproteinpaint({
      host: "https://proteinpaint.stjude.org/",
      holder: containerRef.current,
      parseurl: true,
      block: true,
      nobox: 1,
      noheader: 1,
      genome: "hg38",
      position: `${position.chromosome}:${position.start}-${position.end}`,
      nativetracks: "RefGene",
      hlregions: highlights,
      tracks: [
        {
          __isgene: true,
          translatecoding: true,
          categories: {
            coding: { color: "#004D99", label: "Coding gene" },
            nonCoding: { color: "#009933", label: "Noncoding gene" },
            problem: { color: "#FF3300", label: "Problem" },
            pseudo: { color: "#FF00CC", label: "Pseudogene" },
          },
          type: "bedj",
          name: "GENCODE v34",
          stackheight: 16,
          stackspace: 1,
          vpad: 4,
          file: "anno/gencode.v34.hg38.gz",
        },
        {
          type: "bigwig",
          url: track.url,
          name: track.cellLine,
        },
      ],
    });
  
    // Store the instance on the container ref
    containerRef.current.ppInstance = ppInstance;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">{track.cellLine}</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors duration-200"
              onClick={() => setVisible(!visible)}
              title="Options"
            >
              {BarIcon}
            </button>
            {visible && (
              <div className="px-6 py-7 bg-white rounded-lg flex flex-col gap-2 absolute right-1 top-full mt-2 w-92 z-50 border border-gray-300 overflow-y-auto max-h-96"
                style={{
                  boxShadow: "0 0 3px rgba(0,0,0,0.1), 0 3px 3px rgba(0,0,0,0.1)"
                }}>
                <button
                  className="absolute right-2 top-4 w-8 h-8 flex justify-center items-center hover:bg-gray-200 transition-colors duration-200 rounded-full p-2"
                  onClick={() => setVisible(false)}>
                  {CloseIcon}
                </button>
                <PositionInput
                  setVisible={setVisible}
                  position={position}
                  onPositionUpdate={setPosition}
                />
                <HighLightSelector
                  setVisible={setVisible}
                  hlChromosome={hlChromosome}
                  setHlChromosome={setHlChromosome}
                  hlRanges={hlRanges}
                  setHlRanges={setHlRanges}
                  containerRef={containerRef}
                />
              </div>
            )}
          </div>
          <button
            onClick={onClose || window.close}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Close
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2">
          Position: {position.chromosome}:{position.start}-{position.end}
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div ref={containerRef} className="w-full h-full border border-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default SingleTrackView;