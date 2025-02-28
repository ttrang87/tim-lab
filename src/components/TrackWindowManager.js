/**
 * Utility for opening and managing track windows
 */

// Store references to open windows to avoid duplicates
const openWindows = {};

/**
 * Opens a single track in a new window
 * @param {Object} track - The track data to display
 * @param {Object} position - The genomic position
 */
export const openTrackWindow = (track, position) => {
  // Generate a unique ID for this track
  const trackId = `track-${track.cellLine.replace(/\s+/g, '-').toLowerCase()}`;
  
  // Check if window for this track is already open
  if (openWindows[trackId] && !openWindows[trackId].closed) {
    // Focus the existing window instead of creating a new one
    openWindows[trackId].focus();
    return;
  }
  
  // Create window features
  const windowFeatures = 'width=1000,height=800,resizable=yes,scrollbars=yes,status=yes';
  
  // Open a new window
  const newWindow = window.open('', trackId, windowFeatures);
  
  // Store reference to the window
  openWindows[trackId] = newWindow;
  
  // Create basic HTML structure and load scripts
  newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${track.cellLine}</title>
      <script src="https://proteinpaint.stjude.org/bin/proteinpaint.js"></script>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          margin: 0;
          padding: 0;
          height: 100vh;
          overflow: hidden;
        }
        .container {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .content {
          flex: 1;
          padding: 1rem;
          overflow: auto;
        }
        .track-container {
          width: 100%;
          height: 100%;
          min-height: 500px;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }
        .position-info {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="text-xl font-bold">${track.cellLine}</h1>
          <button onclick="window.close()" class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">Close</button>
        </div>
        <div class="p-4">
          <div class="position-info">
            Position: ${position.chromosome}:${position.start}-${position.end}
          </div>
        </div>
        <div class="content">
          <div id="protein-paint-container" class="track-container"></div>
        </div>
      </div>
      <script>
        window.onload = function() {
          const container = document.getElementById('protein-paint-container');
          
          runproteinpaint({
            host: "https://proteinpaint.stjude.org/",
            holder: container,
            parseurl: true,
            block: true,
            nobox: 1,
            noheader: 1,
            genome: "hg38",
            position: "${position.chromosome}:${position.start}-${position.end}",
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
              {
                type: "bigwig",
                url: "${track.url}",
                name: "${track.cellLine}",
              }
            ],
          });
          
          // Clean up when window is closed
          window.addEventListener('beforeunload', function() {
            delete window.opener.trackWindows["${trackId}"];
          });
        };
      </script>
    </body>
    </html>
  `);
  
  newWindow.document.close();
  
  // Focus the new window
  newWindow.focus();
  
  // Return reference to the window
  return newWindow;
};

// Export a reference to the open windows
export const trackWindows = openWindows;