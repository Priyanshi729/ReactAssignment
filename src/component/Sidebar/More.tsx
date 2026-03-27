import React from 'react'
import { Archive, Star, Trash } from 'lucide-react';


const More: React.FC = () => {

    
    return (
        <div className='w-80 h-39 pl-7 flex flex-col pt-2'>
            <div>
                <p className='text-(--text-bg) text-sm font-semibold' style={{ fontFamily: "var(--font-primary)" }}>More</p>
            </div>
            <button
                      className='flex  gap-4 pt-4 cursor-pointer text-(--text-bg)'>
                <Star className='h-5 w-5' />
                <p style={{ fontFamily: "var(--font-primary)" }} className='text-(--text-bg) text-base'>Favorites</p>
            </button>

            <button className='flex gap-4 pt-4 cursor-pointer text-(--text-bg) '>
                <Trash className='h-5 w-5' />
                <p style={{ fontFamily: "var(--font-primary)" }} className='text-(--text-bg) text-base '>Trash</p>
            </button>
            
            <button className='flex gap-4 pt-4 cursor-pointer text-(--text-bg) '>
                <Archive className='h-5 w-5 ' />
                <p style={{ fontFamily: "var(--font-primary)" }} className='text-(--text-bg) text-base '>Trash</p>
            </button>

        </div>
    )
}

export default More