import './App.css'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import List from './components/CheckinList'
import Register1 from './components/Register1'
import Page from './components/Visitor'
import Login from './components/Login'
import Home from './components/Home'
function App() {
  return (
    <div className=''>
       <Routes>
        <Route path='/list' element={<List/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/page' element={<Page/>}/>
        <Route path='/Visitor' element={<Register1/>}/>
         <Route path="/visitor/:passno" element={<Register />} />
       </Routes>
    </div>
  )
}

export default App
