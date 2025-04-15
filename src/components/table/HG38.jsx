import React, { useState, useEffect, useRef } from 'react';
import SearchFilter from '../feature/SearchEngine';
import { Visualization } from '../feature/Visualization';
import { LinkIcon } from '../../assets/icon';
import {toast, Toaster} from 'react-hot-toast';

const HG38 = () => {
    const [currentData, setCurrentData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [visibleRows, setVisibleRows] = useState(25);
    const [activeVisualizationTracks, setActiveVisualizationTracks] = useState([]);
    const [error, setError] = useState(null);
    const ROWS_PER_PAGE = 14;

    const [changeMode, setChangeMode] = useState(true)
    const containerRef = useRef(null)

    const [definePosition, setDefinePosition] = useState()

    const shortenUrl = (url) => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname + '...';
        } catch (e) {
            return url.substring(0, 30) + '...';
        }
    };

    const parseCSV = (content) => {
        const lines = content.split('\n').filter(line => line.trim());

        return lines.map(line => {
            let columns = [];
            let currentColumn = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    columns.push(currentColumn.trim());
                    currentColumn = '';
                } else {
                    currentColumn += char;
                }
            }

            columns.push(currentColumn.trim());

            return columns.map(col => {
                col = col.replace(/^"|"$/g, '');
                col = col.replace(/\s+/g, ' ');
                return col.trim();
            });
        });
    };

    useEffect(() => {
        const loadCSV = async () => {
            try {
                const filename = changeMode ? 'hg38.csv' : 'position.csv';
                const response = await fetch(`/${filename}`);
                if (!response.ok) {
                    throw new Error(`Failed to load ${filename}`);
                }
                const content = await response.text();
                const parsedData = parseCSV(content);
                setCurrentData(parsedData);
                setFilteredData(parsedData);
                setVisibleRows(ROWS_PER_PAGE);
            } catch (error) {
                console.error('Error loading CSV:', error);
                setError(`Failed to load ${filename}. Please ensure the file exists in the parent directory.`);
            }
        };

        loadCSV();
    }, [changeMode]);

    const showMore = () => {
        setVisibleRows(prev => prev + ROWS_PER_PAGE);
    };

    const showLess = () => {
        setVisibleRows(prev => Math.max(ROWS_PER_PAGE, prev - ROWS_PER_PAGE));
    };

    const handleRowClick = (row, changeMode) => {
        const cellLine = row[0]
        const bigwigUrl = row[row.length - 1]
        const bigbedUrl = row[row.length - 4]

        if (changeMode) {
            setActiveVisualizationTracks((prev) => {
                if (prev.some((track) => track.cellLine === cellLine)) {
                    return prev
                }
                return [...prev, { cellLine: cellLine, bigwig: bigwigUrl, bigbed: bigbedUrl }]
            })
        } else {
            if (activeVisualizationTracks.length == 0) {
                toast.error("Please choose at least 1 Bigwig track", {duration: 1500})
            } else {
                const [chromosome, position] = row[1].split(":")
                const [start, end] = position.split("-")
                const newDefinePosition = {
                    chromosome,
                    start,
                    end
                }
                setDefinePosition(newDefinePosition)

            }
        }
    }

    if (error) {
        return (
            <div className="p-4 text-red-600 bg-red-100 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="flex w-full justify-between gap-12 p-8">
            <Toaster position='top-center' />
            <div className="flex-1 min-w-3xl">
                {currentData.length > 0 && (
                    <>
                        <SearchFilter
                            data={currentData}
                            onFilterChange={(newFilteredData) => {
                                setFilteredData(newFilteredData);
                                setVisibleRows(ROWS_PER_PAGE);
                            }}
                            changeMode={changeMode}
                            setChangeMode={setChangeMode}
                        />

                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse mt-5 flex-wrap">
                                <thead>
                                    <tr>
                                        {currentData[0].map((header, index) => (
                                            <th key={index} className="border border-gray-300 p-1 text-left bg-gray-100">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.slice(1, visibleRows + 1).map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className="hover:bg-gray-100 cursor-pointer even:bg-gray-50"
                                            onClick={() => handleRowClick(row, changeMode)}
                                        >
                                            {row.map((cell, cellIndex) => (
                                                <td
                                                    key={cellIndex}
                                                    className="border border-gray-300 p-1 break-words"
                                                    title={cell.includes(',') ? cell : undefined}
                                                >
                                                    {cell.startsWith('http') ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {shortenUrl(cell)}
                                                            </span>
                                                            {LinkIcon}
                                                        </div>
                                                    ) : cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex gap-4 mt-4">
                                {visibleRows < filteredData.length - 1 && (
                                    <button
                                        onClick={showMore}
                                        className="bg-blue-800 text-white px-2 py-1 rounded-lg text-sm  hover:bg-blue-900 transition-colors duration-200"
                                    >
                                        Show More
                                    </button>
                                )}
                                {visibleRows > ROWS_PER_PAGE && (
                                    <button
                                        onClick={showLess}
                                        className="bg-blue-800 text-white px-2 py-1 rounded-lg text-sm hover:bg-blue-900 transition-colors duration-200"
                                    >
                                        Show Less
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Visualization
                activeVisualizationTracks={activeVisualizationTracks}
                onRemoveTrack={(index) => {
                    setActiveVisualizationTracks(prev =>
                        prev.filter((_, i) => i !== index)
                    );
                }}
                containerRef={containerRef}
                changeMode={changeMode}
                definePosition={definePosition}
            />
        </div>
    );
};

export default HG38;