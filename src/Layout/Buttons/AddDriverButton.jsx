import React from 'react'
import { Link } from 'react-router-dom'

export default function AddDriverButton() {
  return (
<Link to="/NewDriver">
      <button className='bg-[#3C4048] hover:bg-gray-900 focus:outline-none px-4 py-1 rounded-lg border-2 border-white font-sf_bold '>Add Driver</button>
    </Link>  )
}
