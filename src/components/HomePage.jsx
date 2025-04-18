import React from 'react';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/bg.jpg'

function App() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex flex-col items-center justify-center"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '100vh'
            }}>
            <h1 className="text-6xl font-bold text-white mb-20 tracking-tight">GenomePaint</h1>
            <div className="flex flex-col sm:flex-row gap-8 mb-12">
                <button className="w-48 py-4 bg-[#0c2c85] text-white rounded-lg hover:scale-105 transition-transform shadow-lg text-lg font-medium"
                    onClick={() => navigate("/mm10")}>
                    MM10
                </button>
                <button className="w-48 py-4 bg-[#0c2c85] text-white rounded-lg hover:scale-105 transition-transform shadow-lg text-lg font-medium"
                    onClick={() => navigate("/hg38")}>
                    HG38
                </button>
                <button className="w-48 py-4 bg-[#0c2c85] text-white rounded-lg hover:scale-105 transition-transform shadow-lg text-lg font-medium"
                    onClick={() => navigate("/recount3")}>
                    Recount3
                </button>
            </div>
        </div>
    );
}

export default App;