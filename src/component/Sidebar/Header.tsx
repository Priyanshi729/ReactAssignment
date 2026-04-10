import React from 'react'
import Logo from '../../assets/Logo.svg'
import { SearchIcon, Sun, Moon } from 'lucide-react'
import { useApp } from '../../Context/useApp';
import { useTheme } from '../../Context/useTheme';


const Header: React.FC = () => {

    const { searchOpen, setSearchOpen } = useApp();
    const { theme, toggleTheme } = useTheme();


    return (
        <div className='flex justify-between items-center pr-5 pl-6  h-9.5'>
            <img
                src={Logo}
                className={`w-25.25 h-9.5 filter ${theme === 'light' ? 'invert sepia hue-rotate-200 saturate-500' : ''
                    }`}
            />
            <div className='flex gap-4'>
                <button onClick={toggleTheme} className="cursor-pointer">
                {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <SearchIcon onClick={() => setSearchOpen(!searchOpen)}
                className='w-5 h-5 text-(--search-bg) opacity-40  ' />
            </div>
            
        </div>

    )
}

export default Header