import React, { useState } from 'react'
import { TrashIcon } from '../../assets/icon'
import { toast, Toaster } from 'react-hot-toast'

const RangeRows = ({ onRemove, onUpdate, range }) => {
  return (
    <div className='flex items-center gap-2'>
      <input
        type="number"
        placeholder="start e.g., 127735433"
        className="px-2 py-1 border border-gray-300 rounded-lg w-full"
        value={range.start}
        onChange={(e) => onUpdate({ ...range, start: e.target.value })}
      />
      <input
        type="number"
        placeholder="end e.g., 127742951"
        className="px-2 py-1 border border-gray-300 rounded-lg w-full"
        value={range.end}
        onChange={(e) => onUpdate({ ...range, end: e.target.value })}
      />
      <button
        className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 transition-colors duration-200 rounded-full p-2"
        onClick={() => onRemove(range.id)}>
        {TrashIcon}
      </button>
    </div>
  )
}


const HighLightSelector = ({ setVisible, hlChromosome, setHlChromosome, hlRanges, setHlRanges, containerRef }) => {
  const handleRemove = (id) => {
    setHlRanges((prev) => prev.filter(range => range.id !== id))
  }

  const handleAddRange = () => {
    if (!hlChromosome) {
      toast.error("Please fill in chromosome field.", { duration: 1500 });
      return;
    }
    const newRange = {
      id: Date.now(),
      start: '',
      end: ''
    }
    setHlRanges((prev) => [...prev, newRange])
  };

  const handleUpdate = (updatedRange) => {
    setHlRanges(hlRanges.map(range => range.id === updatedRange.id ? updatedRange : range))
  };

  const handleSaveRanges = async () => {
    const invalid = hlRanges.filter(range => !range.start || !range.end || parseInt(range.start) >= parseInt(range.end))

    if (invalid.length > 0) {
      toast.error("Some ranges are invalid. Please check again.", { duration: 1500 })
      return
    }

    const formatRanges = hlRanges.map(range => `${hlChromosome}:${range.start}-${range.end}`)
    const ppInstance = await containerRef.current?.ppInstance;
    if (ppInstance && ppInstance.block) {
      // Clear existing highlights
      if (ppInstance.block.hlregion && ppInstance.block.hlregion.lst) {
        ppInstance.block.hlregion.lst.forEach(hlRegion => {
          if (hlRegion.rect && hlRegion.rect.remove) {
            hlRegion.rect.remove();
          }
        });
        ppInstance.block.hlregion.lst = [];
      }
      // Apply new highlights
      formatRanges.forEach(range => {
        try {
          ppInstance.block.highlight_1basedcoordinate(range);
        } catch (error) {
          console.error(`Could not highlight range ${range}:`, error);
        }
      });
    }

    setVisible(false)


  }
  return (
    <div className='mt-6'>
      <Toaster position='top-center' />
      <div className='font-bold text-lg'>
        Highlight Ranges
      </div>
      <div className='text-gray-600 text-sm mb-3'>Enter chromosome coordinates to highlight</div>
      <div className="flex flex-col gap-2 text-sm">
        <label className='font-semibold'>Chromosome</label>
        <input
          type="text"
          placeholder="chromosome e.g., chr8"
          className="px-2 py-1 border border-gray-300 rounded-lg w-full"
          value={hlChromosome}
          onChange={(e) => setHlChromosome(e.target.value)}
        />
        {hlRanges.length > 0 && (
          <div className='flex flex-col gap-2'>
            <div className='flex gap-4'>
              <div className='text-sm font-semibold w-32'>Start</div>
              <div className='text-sm font-semibold w-32'>End</div>
            </div>
            {hlRanges.map(range => (
              <RangeRows
                key={range.id}
                onRemove={handleRemove}
                onUpdate={handleUpdate}
                range={range}
              />
            ))}
          </div>
        )

        }
      </div>
      <div className='flex items-center gap-3 mt-3'>
        <button
          className="px-1 py-1 w-24 bg-blue-800 text-sm text-white rounded-lg hover:bg-blue-900 transition-colors duration-200"
          onClick={() => handleAddRange()}>
          Add
        </button>
        <button
          onClick={() => handleSaveRanges()}
          className="px-1 py-1 w-24 bg-cyan-800 text-sm text-white rounded-lg hover:bg-cyan-900 transition-colors duration-200"
        >
          Highlight
        </button>

      </div>
    </div>
  )
}

export default HighLightSelector