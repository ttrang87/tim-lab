import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export const PositionInput = ({setVisible, position, onPositionUpdate }) => {
  const [showPosition, setShowPosition] = useState(position)

  const handleUpdate = () => {
    const { chromosome, start, end } = showPosition;
    if (!chromosome || !start || !end) {
      toast.error("Please fill in all fields (Chromosome, Start Position, End Position).", { duration: 1500 })
      return
    }
    if (parseInt(start) >= parseInt(end)) {
      toast.error("End position must be greater than start position.", { duration: 1500 })
      return
    } else {
      onPositionUpdate(showPosition)
      toast.success("Update successfully", { duration: 1500 })
      setVisible(false)
    }
  };

  // if (!visible) return;
  return (
    <div>
      <Toaster position='top-center' />
      <div className='font-bold text-lg'>
        Genomic Position
      </div>
      <div className='text-gray-600 text-sm mb-3'>Enter chromosome coordinates to navigate</div>
      <div className="flex flex-col gap-2 text-sm">
        <label className='font-semibold'>Chromosome</label>
        <input
          type="text"
          placeholder="chromosome e.g., chr8"
          className="px-2 py-1 border border-gray-300 rounded-lg w-full text-sm"
          value={showPosition.chromosome}
          onChange={(e) => setShowPosition({ ...showPosition, chromosome: e.target.value })}
        />
        <div className='flex gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Start</label>
            <input
              type="number"
              placeholder="start e.g., 127735433"
              className="px-2 py-1 border border-gray-300 rounded-lg w-full"
              value={showPosition.start}
              onChange={(e) => setShowPosition({ ...showPosition, start: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-semibold'>End</label>
            <input
              type="number"
              placeholder="end e.g., 127742951"
              className="px-2 py-1 border border-gray-300 rounded-lg w-full"
              value={showPosition.end}
              onChange={(e) => setShowPosition({ ...showPosition, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleUpdate}
        className="mt-3 px-2 py-1 w-28 bg-blue-800 text-sm text-white rounded-lg hover:bg-blue-900 transition-colors duration-200"
      >
        Save Position
      </button>
    </div>
  );
};