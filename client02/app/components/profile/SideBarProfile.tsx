'use client'

import React, { FC } from 'react'
import Image from 'next/image';
import avatarDefault from "../../../public/asstes/avatar.png";
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { AiOutlineLogout } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import Link from 'next/link';

type Props = {
    user : any;
    active : number;
    avatar: string | null;
    setActive: (active : number) => void;
    logOutHandler: any;
}

const SideBarProfile:FC<Props> = ({user, active,avatar,setActive,logOutHandler}) => {

    return ( 
        <div className='w-full'>
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer
             ${active === 1 ? "dark:bg-slate-800 bg-white " : "bg-transparent" } `}
             onClick={() => setActive(1)}
             >
                <Image
                    src={ user.avatar || avatar ? user.avatar.url || avatar: avatarDefault}
                    alt=""
                    width={20}
                    height={20}
                    className="w-[25px] h-[25px] md:w-[30px] md:h-[30px]  cursor-pointer rounded-full"
                 />
                 <h5 className="pl-2 hidden md:block font-Poppins dark:text-white text-black">
                    Tài khoản của tôi
                 </h5>

            </div>
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer
             ${active === 2 ? "dark:bg-slate-800 bg-white " : "bg-transparent" } `}
             onClick={() => setActive(2)}
             >
            
             <RiLockPasswordLine size={20} className="dark:text-white text-black" />

             <h5 className="pl-2 hidden md:block font-Poppins dark:text-white text-black">
                Thay đổi mật khẩu
             </h5>

            </div>

            <div className={`w-full flex items-center px-3 py-4 cursor-pointer
             ${active === 3 ? "dark:bg-slate-800 bg-white " : "bg-transparent" } `}
             onClick={() => setActive(3)}
             >
            
             <SiCoursera size={20} className="dark:text-white text-black" />

             <h5 className="pl-2 hidden md:block font-Poppins dark:text-white text-black">
                    khóa học đã đăng ký
             </h5>

            </div>

           {
            user.role === "admin" && (
                <Link href={"/admin"}
                 className={`w-full flex items-center px-3 py-4 cursor-pointer
                    ${active === 6 ? "dark:bg-slate-800 bg-white " : "bg-transparent" } `}
                    onClick={() => setActive(6)}
                    >
                   
                    <MdOutlineAdminPanelSettings size={25} className="dark:text-white text-black" />
       
                    <h5 className="pl-2 hidden md:block font-Poppins dark:text-white text-black">
                       bảng điều khiển Admin
                    </h5>
       
                   </Link>
            )
           }
             {
            user.role === "Teacher" && (
                <Link href={"/teacher"}
                 className={`w-full flex items-center px-3 py-4 cursor-pointer
                    ${active === 6 ? "dark:bg-slate-800 bg-white " : "bg-transparent" } `}
                    onClick={() => setActive(4)}
                    >
                   
                    <MdOutlineAdminPanelSettings size={25} className="dark:text-white text-black" />
       
                    <h5 className="pl-2 hidden md:block font-Poppins dark:text-white text-black">
                       bảng Teacher
                    </h5>
       
                   </Link>
            )
           }
            <div className={`w-full flex items-center px-3 py-4 cursor-pointer
             ${active === 4 ? "dark:bg-slate-800 bg-white " : "bg-transparent" } `}
             onClick={() => logOutHandler()}
             >
            
             <AiOutlineLogout size={20} className="dark:text-white text-black" />

             <h5 className="pl-2 hidden md:block font-Poppins dark:text-white text-black">
                    Đăng xuất
             </h5>

            </div>
        </div>

    )
}

export default SideBarProfile
