import React from 'react'
import { GrPieChart } from "react-icons/gr";
import { FaRegListAlt } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import { IoReorderThree } from "react-icons/io5";
import { TbListDetails } from "react-icons/tb";
import { Link } from 'react-router-dom';
import Logo from '../img/logo.png'

let List = [
  {
    img: MdAddBox,
    name: "Check-In",
    url : "Visitor"
  },
  {
    img: TbListDetails,
    name: "Check-In List",
    url : "page"
  },
  {
    img: FaRegListAlt,
    name: "Visitor Details",
    url: "list"
  }
]
const Side_Bar = () => {
  return (
    <div className='flex flex-col p-5 gap-4 absolute bg-[#dad9d9] h-[100%]'>
          <Link to={'/home'} className='flex flex-row items-center gap-3 py-1 '>
            <img src={Logo} className='sidebar-mobile' alt=""  width={30} />
            <p className='font-bold text-navyblue font-sans '>Visitor Hub</p>
            </Link>
          <div className='flex flex-col gap-6'>
            {List.map((data) => (
              <Link key={data.name} className="flex flex-row items-center gap-4" to={`/${data.url}`}>
                <data.img className="sidebar-icons" />
                <h1 className='sidebar-mobile'>{data.name}</h1>
              </Link>
            ))}
          </div>
        </div>
  )
}

export default Side_Bar