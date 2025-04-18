import React, { createContext, useState } from "react";

export const ScaleContext = createContext(null);

export const ScaleProvider = ({children}) => {
    const [scale, setScale] = useState(false);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [height, setHeight] = useState(100);
    const [hlRanges, setHlRanges] = useState([])
    const [hlChromosome, setHlChromosome] = useState("chr8")


    return (
        <ScaleContext.Provider value={{
            scale, setScale,
            min, setMin, 
            max, setMax,
            height, setHeight,
            hlRanges, setHlRanges,
            hlChromosome, setHlChromosome
        }}>
            {children}
        </ScaleContext.Provider>
    );
};