'use client'
import React, { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import avatarIcon from "../../../public/asstes/avatar.png";
import { AiOutlineCamera } from 'react-icons/ai';
import { Style } from "../../style/stylelogin";
import { useEditProfileMutation, useUpdateAvatarMutation } from '@/redux/features/user/userApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSilce';

type Props = {
    avatar: string | null;
    user: any;
};


const ProfileInfo: FC<Props> = ({ avatar, user }) => {
    const [name, setName] = useState(user && user.name);
    const [updatedAvatar, {isSuccess, error}] = useUpdateAvatarMutation();
    const [editProfile, {isSuccess:success, error:updateError}] = useEditProfileMutation();
    const [localAvatar, setLocalAvatar] = useState<string | null>(null);
    // const [loadUser, setLoadUser] = useState(false);
    // const {} = useLoadUserQuery(undefined, {
    //     skip: loadUser ? false : true
    // })
    
    // const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0]; // Lấy file đầu tiên
    //     if (!file) return; // Kiểm tra nếu không có file được chọn
    
    //     const fileReader = new FileReader();
    
    //     fileReader.onload = () => {
    //         if (fileReader.readyState === 2) {
    //             const avatar = fileReader.result; // Base64 string
    //             updatedAvatar(avatar); // Gửi avatar tới API
    //         }
    //     };
    
    //     fileReader.readAsDataURL(file); // Đọc file dưới dạng base64
    // };
    
    //     useEffect(() => {
    //         if(isSuccess || success){
    //             setLoadUser(true);
    //         }
    //         if(error || updateError){
    //             console.log(error)
    //         }
    //     },[isSuccess, error, success, updateError]);

    // const handlerSubmit = async (e: any) => {
    //     e.preventDefault();
    //     if(name !== ""){{
    //         await editProfile({
    //             name: name,
    //         })
    //     }}
    // };

    const { data: userData, refetch } = useLoadUserQuery(undefined, { skip: false });

useEffect(() => {
    if (isSuccess || success) {
        refetch();
    }
    if (error || updateError) {
        console.error(error || updateError);
    }
}, [isSuccess, success, error, updateError, refetch]);

const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async () => {
        if (fileReader.readyState === 2) {
            const avatar = fileReader.result as string;
            setLocalAvatar(avatar)
            const response = await updatedAvatar(avatar);
            if (response?.data) {
                refetch();
            } else {
                console.error("Lỗi khi cập nhật avatar");
            }
        }
    };
    fileReader.readAsDataURL(file);
};

const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
        const response = await editProfile({ name });
        if (response?.data) {
            refetch();
        } else {
            console.error("Lỗi khi cập nhật thông tin");
        }
    }
};


    return (
      <>
        <div className="w-full flex justify-center">
          <div className="relative">
            <Image
              // src={updatedAvatar || user.avatar?.url || avatar || avatarIcon} // Dùng state updatedAvatar nếu có
              src={
                localAvatar || user.avatar?.url || avatar || avatarIcon
              } // Dùng state updatedAvatar nếu có
              alt=""
              width={120}
              height={120}
              className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
            />
            <input
              type="file"
              name=""
              id="avatar"
              className="hidden"
              onChange={imageHandler}
              accept="image/png, image/jpg, image/jpeg, image/webp"
            />
            <label htmlFor="avatar">
              <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                <AiOutlineCamera size={20} className="z-1" />
              </div>
            </label>
          </div>
        </div>

        <br />
        <br />
        <div className="w-full pl-6 md:pl-20">
          <form onSubmit={handlerSubmit}>
            <div className="md:w-[50%] w-full m-auto block pb-4 ml-auto">
              {/* Full Name Input */}
              <div className="w-full mb-4">
                <label className="block text-lg font-semibold pb-2 text-gray-700 dark:text-white">
                  Tên tài khoản
                </label>
                <input
                  type="text"
                  className={`${Style.input} !w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#37a39a] transition duration-200`}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email Address Input */}
              <div className="w-full mb-6">
                <label className="block text-lg font-semibold pb-2 text-gray-700 dark:text-white">
                  Email tài khoản
                </label>
                <input
                  type="text"
                  readOnly
                  className={`${Style.input} !w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#37a39a] transition duration-200`}
                  required
                  value={user?.email}
                />
                <label className="block text-lg font-semibold pb-2 text-gray-700 dark:text-white">
                  Cấp Độ
                </label>
                <input
                  type="text"
                  readOnly
                  className={`${Style.input} !w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#37a39a] transition duration-200`}
                  required
                  value={user?.level}
                  disabled
                />
                <label className="block text-lg font-semibold pb-2 text-gray-700 dark:text-white">
                  Chức Vụ
                </label>
                <input
                  type="text"
                  readOnly
                  className={`${Style.input} !w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#37a39a] transition duration-200`}
                  required
                  value={user?.role}
                  disabled
                />
              </div>

              {/* Submit Button */}
              <input
                type="submit"
                className="w-full h-[40px] border border-[#37a39a] text-center dark:text-white text-black bg-[#37a39a] hover:bg-[#2e8b7d] rounded-[3px] mt-6 cursor-pointer transition-all duration-300"
                required
                value="Update"
              />
            </div>
          </form>
        </div>
      </>
    );
};

export default ProfileInfo;
