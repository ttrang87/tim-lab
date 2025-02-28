import React, { useEffect, useRef, useState } from "react"

export default function ProteinPaint({ activeTracks, position, containerRef, height, min, max }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (activeTracks.length === 0) {
      return
    }

    if (!isInitialized) {
      const script = document.createElement("script")
      script.src = "https://proteinpaint.stjude.org/bin/proteinpaint.js"
      script.onload = () => {
        setIsInitialized(true)
      }
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    } else {
      updateProteinPaint()
    }
  }, [activeTracks, position, isInitialized, min, max, height])

  const updateProteinPaint = async () => {
    if (!containerRef.current || !window.runproteinpaint) return

    if (containerRef.current.ppInstance && containerRef.current.ppInstance.destroy) {
      containerRef.current.ppInstance.destroy()
    }
    // Clear previous visualization
    containerRef.current.innerHTML = ''

    // Initialize ProteinPaint and store the instance
    const ppInstance = await window.runproteinpaint({
      host: "https://proteinpaint.stjude.org/",
      holder: containerRef.current,
      parseurl: true,
      block: true,
      nobox: 1,
      noheader: 1,
      genome: "hg38",
      position: position,
      nativetracks: "RefGene",
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
        ...activeTracks.map((track) => ({
          type: "bigwig",
          url: track.url,
          name: track.cellLine,
          height: height,
          scale: {
            min: min,
            max: max,
          }
        })),
      ],
    })

    // Store the instance on the container ref
    containerRef.current.ppInstance = ppInstance
  }

  return (
    <div className="min-h-[400px] w-full">
      {activeTracks.length > 0 ? (
        <div ref={containerRef} className="m-2.5" />
      ) : (
        <div className="flex items-center justify-center h-full text-sm">
          No active tracks
        </div>
      )}
    </div>
  )
}