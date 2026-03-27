import React from 'react'
import SideLayout from './component/Sidebar/SideLayout'
import { AppProvider } from './Context/AppProvider'




const App:React.FC = () => {
  return (
    <AppProvider>
       <SideLayout/>
    </AppProvider>
  )
}

export default App