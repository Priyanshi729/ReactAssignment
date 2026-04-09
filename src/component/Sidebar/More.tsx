import React from 'react'
import { Archive, Star, Trash as TrashIcon } from 'lucide-react';
import { useApp } from '../../Context/useApp';
import { useNavigate } from 'react-router';

const More: React.FC = () => {
    
    const { setActiveView } = useApp(); 
    const navigate = useNavigate();

    return (
        <div className='w-80 h-39 pl-7 flex flex-col pt-2'>
            <div>
                <p className='text-(--text-bg) text-sm font-semibold' style={{ fontFamily: "var(--font-primary)" }}>
                    More
                </p>
            </div>

            <button
                onClick={() => {setActiveView("favorites");
                                navigate("/favorites")
                }} 
                className='flex gap-4 pt-4 cursor-pointer text-(--text-bg) hover:bg-(--hover-bg)'
            >
                <Star className='h-5 w-5' />
                <p className='text-(--text-bg) text-base'>Favorites</p>
            </button>

            <button
                onClick={() => {setActiveView("trash")
                                navigate("/trash")
                }}
                className='flex gap-4 pt-4 cursor-pointer text-(--text-bg) hover:bg-(--hover-bg)'
            >
                <TrashIcon className='h-5 w-5' />
                <p className='text-(--text-bg) text-base'>Trash</p>
            </button>

            <button
                onClick={() => {setActiveView("archived")
                                navigate("/archived")
                }}
                className='flex gap-4 pt-4 cursor-pointer  text-(--text-bg) hover:bg-(--hover-bg)'
            >
                <Archive className='h-5 w-5' />
                <p className='text-(--text-bg) text-base'>Archive</p>
            </button>

        </div>
    )
}

export default More;