import React from 'react'
import HeaderBar from './Headerbar'
import SidebarNew from './Sidebar'
import Loading from './Loading'


const Layout = ({ children }) => {


  return (
    <div class="flex h-screen">
      {/* <!-- Sidebar --> */}
      <div class="bg-[#222831] text-white   flex-none">
        <SidebarNew/>
      </div>
      <div class="flex flex-col w-full overflow-hidden">
        <div class=" text-white flex-none">
      <HeaderBar />
        </div>
        <div class="flex-1 overflow-y-scroll p-1">
          <div className="m-4 ">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Layout