import React, { useContext, useEffect, useState } from 'react';
import { PositionInput } from './PositionInput';
import { TrashIcon, BarIcon, ExportIcon } from '../../assets/icon';
import ProteinPaint from './ProteinPaint';
import HighLightSelector from './HighLightSelector';
import Scale from './Scale';
import { CloseIcon } from '../../assets/icon';
import { ScaleContext } from '../context';


export const Visualization = ({ activeVisualizationTracks, onRemoveTrack, containerRef, changeMode, definePosition, exportState}) => {
    const [visible, setVisible] = useState(false)
    
    const {min, setMin, max, setMax, scale, setScale, height, setHeight, hlRanges, setHlRanges, hlChromosome, setHlChromosome} = useContext(ScaleContext)


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
        // Save current settings to localStorage or encode in URL
        localStorage.setItem('EXPORT_TRACKS', JSON.stringify(activeVisualizationTracks));
        localStorage.setItem('EXPORT_POSITION', JSON.stringify(position));
        localStorage.setItem('EXPORT_HIGHLIGHT', JSON.stringify({
            chr: hlChromosome,
            ranges: hlRanges
        }));
        localStorage.setItem('EXPORT_SCALE', JSON.stringify({
            height, min, max, scale
        }));

        // Open new route in a new tab
        window.open('/export', '_blank');
    };


    return (
        <div className='flex flex-col gap-4 pt-3'>
            <div className='flex justify-between items-start px-8'>
                {exportState && (
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
                    </div>)}
                <div className="flex relative ml-auto gap-3">
                    {exportState && (
                        <button
                            className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors-200 duration-200"
                            onClick={handleExportClick}
                            title='Open in other tab'
                        >
                            {ExportIcon}
                        </button>
                    )}
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
                setPosition={setPosition}
                containerRef={containerRef}  // Example position
                includeGeneTrack={exportState}
                hlRanges={hlRanges}
                hlChromosome={hlChromosome}
            />
        </div>
    )
};


