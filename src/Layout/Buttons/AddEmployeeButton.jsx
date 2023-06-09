import React from 'react'
import { Link } from 'react-router-dom'

export default function AddEmployeeButton() {
  return (
<Link to="/addEmployee">
      <button className='bg-[#3C4048] px-4 py-1 hover:bg-gray-900 focus:outline-none rounded-lg border-2 border-white font-sf_bold '>Add Empolyee</button>
    </Link>  )
}
