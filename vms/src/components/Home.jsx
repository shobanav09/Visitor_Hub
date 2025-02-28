import React from 'react'
import { useState } from 'react';
import SideBar from './Side_Bar';
import General from './General'
const Home = () => {
const [show,setShow] = useState(true);
  return (
    <div>
        <SideBar/>
        <General show={show} setShow={setShow}/>
    </div>
  )
}

export default Home