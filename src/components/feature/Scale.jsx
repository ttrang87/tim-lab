import React, { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'

const Scale = ({ setVisible, setScale, height, setHeight, min, setMin, max, setMax }) => {
    const [showHeight, setShowHeight] = useState(height)
    const [showMin, setShowMin] = useState(min)
    const [showMax, setShowMax] = useState(max)

    const handleSave = () => {
        setScale(true)
        if (showHeight === "" || showMin === "" || showMax === "") {
            toast.error("Please fill in all fields.", { duration: 1500 })
            return
        }
        if (parseInt(showMin) >= parseInt(showMax)) {
            toast.error("End position must be greater than start position.", { duration: 1500 })
            return
        } else {
            setHeight(parseInt(showHeight))
            setMin(parseInt(showMin))
            setMax(parseInt(showMax))
            setVisible(false)
        }
    }

    const handleOrigin = () => {
        setScale(false)
    }
    return (
        <div>
            <Toaster position='top-center' />
            <div className='font-bold text-lg mt-6 mb-2'>
                Track Scale
            </div>
            <div className='flex gap-4'>
                <div className="flex flex-col gap-2">
                    <label className='text-sm font-semibold'>Height</label>
                    <input
                        type="text"
                        placeholder="e.g., 100"
                        className="px-2 py-1 border border-gray-300 rounded-lg w-full text-sm"
                        value={showHeight}
                        onChange={(e) => setShowHeight(e.target.value)}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold'>From</label>
                    <input
                        type="number"
                        placeholder="e.g., 0"
                        className="px-2 py-1 border border-gray-300 rounded-lg w-full text-sm"
                        value={showMin}
                        onChange={(e) => setShowMin(e.target.value)}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold'>To</label>
                    <input
                        type="number"
                        placeholder="e.g., 300"
                        className="px-2 py-1 border border-gray-300 rounded-lg w-full text-sm"
                        value={showMax}
                        onChange={(e) => setShowMax(e.target.value)}
                    />
                </div>
            </div>
            <div className='flex gap-2'>
                <button
                    onClick={handleSave}
                    className="mt-3 px-2 py-1 w-24 bg-blue-800 text-sm text-white rounded-lg hover:bg-blue-900 transition-colors duration-200"
                >
                    Save Scale
                </button>
                <button
                    onClick={handleOrigin}
                    className="mt-3 px-2 py-1 w-24 bg-cyan-800 text-sm text-white rounded-lg hover:bg-cyan-900 transition-colors duration-200"
                >
                    No Scale
                </button>
            </div>
        </div>
    );
}

export default Scale