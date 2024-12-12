import { Label } from '@mui/icons-material';
import React, { FC, useEffect, useState } from 'react'
import { Style } from "../../style/stylelogin";
import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import toast from 'react-hot-toast';

type Props = {}

const ChangePassword:FC<Props> = (props) => {

    const [oldPassword, setOldPassword] =useState("");
    const [newPassword, setNewPassword] =useState("");
    const [confirmPassword, setConfirmPassword] =useState("");
    const [updatePassword, {isSuccess, error}] = useUpdatePasswordMutation();

    const passwordCChangeHandler = async (e:any) => {
        e.preventDefault();
        if(newPassword !== confirmPassword) {
        toast.error("Password do not match");
        }else {
            await updatePassword({oldPassword, newPassword});
        }
    };

    useEffect(()=> {
        if(isSuccess){
            toast.success("Password changed successfully")
        }
        if(error){
            if("data" in error){
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    },[isSuccess, error])

    return ( 
        <div className="w-full pl-7 px-2 md:px-5 md:pl-0">
            <h1 className="block text-[25px] md:text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-2">
                Thay Đổi Mật Khẩu
            </h1>
            <div className="w-full items-center justify-center ">
            <form
        aria-required
        onSubmit={passwordCChangeHandler}
        className="flex flex-col items-center justify-center ml-[10%]"
    >
        <div className="w-[100%] md:w-[60%] mt-5">
            <label className="block pb-2 text-xl font-semibold text-black dark:text-[#fff]">
                Nhập mật khẩu cũ của bạn
            </label>
            <input
                type="password"
                className={`${Style.input} !w-[95%] mb-4 md:mb-0 text-black dark:text-[#fff] p-4 border-[3px] border-gray-400 rounded-md`}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
        </div>
        <div className="w-[100%] md:w-[60%] mt-2">
            <label className="block pb-2 text-xl font-semibold text-black dark:text-[#fff]">
                Nhập mật khẩu mới của bạn
            </label>
            <input
                type="password"
                className={`${Style.input} !w-[95%] mb-4 md:mb-0 text-black dark:text-[#fff] p-4 border-[3px] border-gray-400 rounded-md`}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
        </div>
        <div className="w-[100%] md:w-[60%] mt-2">
            <label className="block pb-2 text-xl font-semibold text-black dark:text-[#fff]">
                Nhập lại mật khẩu của bạn
            </label>
            <input
                type="password"
                className={`${Style.input} !w-[95%] mb-4 md:mb-0 text-black dark:text-[#fff] p-4 border-[3px] border-gray-400 rounded-md`}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
        </div>
        <input
            type="submit"
            className="w-[40%] h-[45px] border-[3px] border-[#37a39a] text-center dark:text-white text-black  rounded-md mt-6 cursor-pointer transition-all duration-300 text-lg font-semibold"
            value="Update"
        />
    </form>
            </div>
        </div>
    )
}

export default ChangePassword