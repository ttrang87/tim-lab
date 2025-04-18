import React, { useContext, useEffect, useState } from "react"
import { ScaleContext } from "../context"

export default function ProteinPaint({ activeTracks, position, setPosition, containerRef, hlChromosome, hlRanges, includeGeneTrack = true }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const { min, max, scale, height } = useContext(ScaleContext)
  const [ppInstanceReady, setPpInstanceReady] = useState(false);

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
  }, [activeTracks, position, isInitialized, min, max, height, scale])

  useEffect(() => {
    if (isInitialized) {
      applyHighlight();
    }
  }, [ppInstanceReady]);

  const applyHighlight = async () => {
    const formatRanges = hlRanges.map(range => `${hlChromosome}: ${range.start} - ${range.end}`);
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
    } }

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
      ...(includeGeneTrack
        ? [{
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
        }]
        : []),
      ...activeTracks.flatMap((track) => {
        const trackConfig = {
          type: "bigwig",
          url: track.bigwig,
          name: track.cellLine
        }
        const bigbedConfig = {
          type: "bedj",
          url: track.bigbed,
          name: "bigBed demo",
        }

        if (height) {
          trackConfig.height = height
        }

        if (scale) {
          trackConfig.scale = {
            min: min,
            max: max
          }
        }

        return [trackConfig, bigbedConfig]
      }),
    ],
  })

  // Store the instance on the container ref
  containerRef.current.ppInstance = ppInstance
  setPpInstanceReady(true)
  // const formatRanges = hlRanges.map(range => `${hlChromosome}:${range.start}-${range.end}`)
  // if (ppInstance && ppInstance.block) {
  //   // Clear existing highlights
  //   if (ppInstance.block.hlregion && ppInstance.block.hlregion.lst) {
  //     ppInstance.block.hlregion.lst.forEach(hlRegion => {
  //       if (hlRegion.rect && hlRegion.rect.remove) {
  //         hlRegion.rect.remove();
  //       }
  //     });
  //     ppInstance.block.hlregion.lst = [];
  //   }
  //   // Apply new highlights
  //   formatRanges.forEach(range => {
  //     try {
  //       ppInstance.block.highlight_1basedcoordinate(range);
  //     } catch (error) {
  //       console.error(`Could not highlight range ${range}:`, error);
  //     }
  //   });
  // }

  const coordInput = document.querySelector('input[aria-label="Genome browser coordinates"]');

  let lastVal = coordInput?.value;

  const logIfChanged = () => {
    if (!coordInput) return;

    const currentVal = coordInput.value;
    if (currentVal !== lastVal) {
      lastVal = currentVal;
      const [chromosome, position] = currentVal.split(":")
      const [start, end] = position.split("-")
      const newPosition = {
        chromosome,
        start,
        end
      }
      setPosition(newPosition)
    }
  };

  // MutationObserver for attribute changes
  const observer = new MutationObserver(logIfChanged);
  observer.observe(coordInput, { attributes: true, attributeFilter: ['value'] });

  // Also poll every 300ms just in case
  setInterval(logIfChanged, 300);






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