import React from 'react'
import homepage from '../assets/homepage.png'
import { useNavigate } from 'react-router-dom'
const HomePage = () => {
    const navigate = useNavigate()
    return (
        <div
            style={{
                backgroundImage: `url(${homepage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '100vh'
            }}>
            <div className='flex flex-col justify-center items-end h-full px-10'>
                <div className='flex flex-col items-center w-1/5 gap-12 justify-center mr-32 mb-4'>
                    <div className='text-4xl text-blue-100 font-bold text-center w-full'>GenomePaint</div>
                    <div className='flex flex-col gap-4 justify-center items-center w-full text-black font-semibold'>
                        <button
                            className='px-4 py-3 rounded-full shadow-lg w-full hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-cyan-400 to-sky-700'
                            onClick={() => navigate("/mm10")}>MM10</button>
                        <button className='px-4 py-3 rounded-full shadow-lg bg-gradient-to-r from-cyan-400 to-sky-700 w-full hover:scale-105 transition-transform duration-200 bg-sky-700'>HG38</button>
                        <button
                            className='px-4 py-3 rounded-full shadow-lg bg-gradient-to-r from-cyan-400 to-sky-700 w-full hover:scale-105 transition-transform duration-200 bg-sky-700'
                            onClick={() => navigate("/recount3")}>
                            Recount3</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HomePage