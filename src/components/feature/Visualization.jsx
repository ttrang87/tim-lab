import React, { useEffect, useState, useRef } from 'react';
import { PositionInput } from './PositionInput';
import { TrashIcon, BarIcon, ExportIcon } from '../../assets/icon';
import ProteinPaint from './ProteinPaint';
import HighLightSelector from './HighLightSelector';
import Scale from './Scale';
import { CloseIcon } from '../../assets/icon';
// import { openTrackWindow } from './TrackWindowManager';

export const Visualization = ({ activeVisualizationTracks, onRemoveTrack, containerRef, changeMode, definePosition }) => {
    const [visible, setVisible] = useState(false)
    const [hlChromosome, setHlChromosome] = useState('')
    const [hlRanges, setHlRanges] = useState([])
    const [height, setHeight] = useState(100)
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(100)
    const [scale, setScale] = useState(false)

    // Get position in local storage:
    const [position, setPosition] = useState({
        chromosome: localStorage.getItem('DEFAULT_CHROMOSOME') || 'chr8',
        start: localStorage.getItem('DEFAULT_START') || '127735433',
        end: localStorage.getItem('DEFAULT_END') || '127742951'
    });

    useEffect(() => {
        localStorage.setItem('DEFAULT_CHROMOSOME', position.chromosome);
        localStorage.setItem('DEFAULT_START', position.start);
        localStorage.setItem('DEFAULT_END', position.end);
    }, [position]);

    useEffect(() => {
        if (!changeMode && definePosition) {
            setPosition(definePosition);
            setVisible(false);
        }
    }, [definePosition]);

    const handleExportClick = () => {
        if (!containerRef.current || !window.runproteinpaint) return;

        const formattedPosition = `${position.chromosome}:${position.start}-${position.end}`;

        const filteredTracks = activeVisualizationTracks.flatMap((track) => {
            const trackConfig = {
                type: "bigwig",
                url: track.bigwig,
                name: track.cellLine,
            };
            const bigbedConfig = {
                type: "bedj",
                url: track.bigbed,
                name: "bigBed demo",
            };

            if (height) {
                trackConfig.height = height;
            }

            if (scale) {
                trackConfig.scale = {
                    min: min,
                    max: max,
                };
            }

            return [trackConfig, bigbedConfig];
        });

        // Convert highlight regions to format expected by ProteinPaint
        const highlight = hlRanges.length > 0
            ? {
                chr: hlChromosome,
                regions: hlRanges.map(range => ({
                    start: +range.start,
                    stop: +range.end
                }))
            }
            : null;

        const newWindow = window.open("", "_blank");
        if (!newWindow) return;

        newWindow.document.write(`
          <html>
            <head>
              <title>ProteinPaint Export</title>
              <script src="https://proteinpaint.stjude.org/bin/proteinpaint.js"></script>
            </head>
            <body>
              <div id="pp-holder" style="min-height:400px;"></div>
              <script>
                window.onload = function () {
                  runproteinpaint({
                    host: "https://proteinpaint.stjude.org/",
                    holder: document.getElementById("pp-holder"),
                    parseurl: true,
                    block: true,
                    nobox: 1,
                    noheader: 1,
                    genome: "hg38",
                    position: "${formattedPosition}",
                    ${highlight ? `highlightregions: [${JSON.stringify(highlight)}],` : ""}
                    nativetracks: "RefGene",
                    tracks: ${JSON.stringify(filteredTracks)}
                  });
                }
              </script>
            </body>
          </html>
        `);
        newWindow.document.close();
    };



    return (
        <div className='flex flex-col gap-4 pt-3'>
            <div className='flex justify-between items-start px-8'>
                <div className="grid grid-cols-6 gap-4">
                    {activeVisualizationTracks.map((track, index) => (
                        <div key={index} className="flex items-center justify-between gap-1 bg-gray-100 rounded-full py-1 pl-3 pr-2">
                            <span className="cursor-pointer hover:text-blue-600"
                                onClick={() => handleTrackClick(track)}
                                title="Open in new window">
                                {track.cellLine}
                            </span>
                            <button
                                onClick={() => onRemoveTrack(index)}
                                className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 transition-colors duration-200 rounded-full p-2"
                            >
                                {TrashIcon}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-3 relative">
                    <button
                        className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors-200 duration-200"
                        onClick={() => handleExportClick(position)}
                        title='Open in other tab'
                    >
                        {ExportIcon}
                    </button>
                    <button
                        className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors-200 duration-200"
                        onClick={() => setVisible(!visible)}
                        title='Select position, highlight, scale'
                    >
                        {BarIcon}
                    </button>
                    {visible && (
                        <div className="px-6 py-7 bg-white rounded-lg flex flex-col gap-2 absolute right-1 top-full mt-2 w-96 z-50 border border-gray-300 overflow-y-auto max-h-96"
                            style={{
                                boxShadow: "0 0 3px rgba(0,0,0,0.1), 0 3px 3px rgba(0,0,0,0.1)"
                            }}>
                            {/* <Toaster position='top-center' /> */}
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
                            <Scale
                                setVisible={setVisible}
                                height={height}
                                setHeight={setHeight}
                                min={min}
                                setMin={setMin}
                                max={max}
                                setMax={setMax}
                                setScale={setScale} />
                        </div>)}
                </div>
            </div>
            <ProteinPaint
                activeTracks={activeVisualizationTracks}
                position={`${position.chromosome}:${position.start}-${position.end}`}
                containerRef={containerRef}  // Example position
                height={height}
                min={min}
                max={max}
                scale={scale}
            />
        </div>
    )
};


