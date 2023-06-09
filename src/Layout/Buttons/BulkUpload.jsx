import React from 'react'
import Bulk from '../../assets/images/HomeAssest/BulkUpload.png'
import { Link } from 'react-router-dom'


function BulkUpload() {
    return (
        <>
            <div className='px-2'>
                <Link to="/bulkcsv">
                    <button type="button" class=" px-3 py-1 mr-2 mb-2 text-white border-2 border-white rounded-[15px] bg-[#3C4048] hover:bg-gray-900 focus:outline-none   font-medium  text-sm ">
                        <img className='w-[40px] h-[40px] ' src={Bulk} alt="json" />
                    </button>
                </Link>
            </div>

        </>

    )
}

export default BulkUpload