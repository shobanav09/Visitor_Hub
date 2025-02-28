import React from 'react'
import { IoPerson } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";
import { PiIdentificationCard } from "react-icons/pi";
import { LuBuilding } from "react-icons/lu";
import { BsDiagram2 } from "react-icons/bs";
import { BsPersonLock } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { LiaUserTieSolid } from "react-icons/lia";
import { LiaMailBulkSolid } from "react-icons/lia";
import { FaHandHoldingWater } from "react-icons/fa";
import { BsDiagram3 } from "react-icons/bs";
import { useState } from 'react';

const List = [
  {
    img: MdOutlinePersonOutline,
    title: "User Role",
    desc: "Create and manage User Roles; Define access control for the modules",
  },
  {
    img: BsPersonLock,
    title: "Login",
    desc: "Create and manage User logins; Enable/disable user logins",
  },
  {
    img: BsDiagram2,
    title: "Department",
    desc: "Create and manage Departments",
  },
  {
    img: BsDiagram3,
    title: "Section",
    desc: "Create and manage Seactions under a Department",
  },
  {
    img: LiaUserTieSolid,
    title: "Employee",
    desc: "Create and manage Employees",
  },
  {
    img: FaHandHoldingWater,
    title: "Vendor",
    desc: "Create and manage Vendors",
  },
  {
    img: LuBuilding,
    title: "Company",
    desc: "Create and manage Company details",
  },
  {
    img: PiIdentificationCard,
    title: "Contacts",
    desc: "Create and manage Contact/Visitor details",
  },
  {
    img: CiLocationOn,
    title: "Location",
    desc: "Create and manage Location",
  },
  {
    img: LiaMailBulkSolid,
    title: "Mail Server Configuration",
    desc: "Mail Server Configuration",
  }

]

const General = ({show ,setShow}) => {
  return (

    <div>
      {
      show && (
        <div className=' ml-[200px] p-3 border border py-5 mr-3'>
        <div className='font-bold m-1 border-b border-[var(--color)] '>General</div>
        <div className='general-items mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
          {
            List.map((data, index) => 
              <div key={index} className='items-center gap-2 flex my-5'> 
                <div className='general-icons' >{<data.img />}</div>
                <div className='flex flex-col'>
                  <div className='font-bold text-2l'>{data.title}</div>
                  <div>{data.desc}</div>
                </div>
              </div>
            )
          }
        </div>
      </div>
      )
    }
    </div>
    
  )
}

export default General
