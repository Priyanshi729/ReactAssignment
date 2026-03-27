import React from 'react'
import Logo from '../../assets/Logo.svg'
import { SearchIcon } from 'lucide-react'

const Header: React.FC = () => {
    
    return (
            <div className='flex justify-between items-center pr-5 pl-6  h-9.5'>
                <img src={Logo} className='w-25.25 h-9.5' />
                <SearchIcon  className='w-5 h-5 text-[#FFFFFF] opacity-40  '/>
            </div>
        
    )
}

export default Header