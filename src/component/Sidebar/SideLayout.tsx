import React from 'react'
import Header from './Header'
import AddNote from './AddNote'
import Recents from './Recents'
import Folder from './Folder'
import More from './More'
import NoteItem from '../Notes/NoteItem'
import NoteDetail from '../Notes/NoteDetail'

const SideLayout: React.FC = () => {
   
 


    return (
        <div className='w-full h-screen flex bg-(--sidebar-bg) pt-7 overflow-hidden '>
            <div className='flex flex-col gap-8 w-80 h-screen overflow-y-auto'>
                <Header />
                <AddNote />
                <Recents />
                <Folder  />
                <More />
            </div>


            <NoteItem/>

            <NoteDetail />


        </div>
    )
}

export default SideLayout