import React, { FC } from 'react'
import CoursePlayer from "../../../Utils/CoursePlayer"
import { Style } from '@/app/style/stylelogin';
import Ratings from '../../../Utils/Ratings'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

type Props = {
    active: number;
    setActive: (active: number) => void;
    courseData: any
    handleCourseCreate: any;
    isEdit?:boolean;
}


const CoursePreview:FC<Props> = ({active,handleCourseCreate,courseData,setActive,isEdit }) => {

    const discountPercentenge = ((courseData?.estimatedPrice - courseData?.price) / 
    courseData?.estimatedPrice) *100;

    const discountPercentengePrice =discountPercentenge.toFixed(0);


    const  prevButton = () => {
        setActive(active - 1 )
    }
    
    const createCourse= () => {
        handleCourseCreate();
    }

    
    return ( 
        <div className='w-[90%] m-auto py-5 mb-5'>
            <div className='w-full relative'>
                <div className='w-full mt-10'>
                    <CoursePlayer 
                        videoUrl={courseData?.demoUrl}
                        // videoUrl={courseData?.courseContent[0].videoUrl}
                        title={courseData?.title}
                    />
                </div>
                <div className='flex items-center'>
                    <h1 className='pt-5 text-[25px]'>
                        {courseData?.price === 0 ? "free" : courseData?.price + "$" }
                    </h1>
                    <h5 className='pl-3 text-[20px] mt-2 line-through opacity-80'>
                        {courseData?.estimatedPrice}$
                    </h5>

                    <h4 className='pl-5 pt-4 text-[22px]'>
                        {discountPercentengePrice}$ off
                    </h4>
                </div>
                <div className='flex items-center'>
                    <div className={`${Style.button} w-[180px] my-3 font-Poppins !bg-[crimson] cursor-not-allowed` }>
                        mua ngay bây giờ {courseData?.price}$

                    </div>
                </div>
                <div className='flex items-center'>
                    <input 
                        type='text'
                        name=''
                        id=''
                        placeholder='Mã giảm giá...'
                        className={`${Style.input} !w-[75%]  ml-3 !mt-0`}
                    />
                    <div className={`${Style.button} !w-[120px] my-3 ml-4 font-Poppins cursor-pointer`}>
                    Áp dụng
                    </div>
                </div>
                <p className='pb-1'>. mã nguồn bao gồm</p>
                    <p className='pb-1'>. truy cập trọn đời</p>
                    <p className='pb-1'>. giấy chứng nhận hoàn thành</p>
                    <p className='pb-3 md:pb-1'>. Hỗ trợ cao cấp</p>
            </div>
            <div className='w-full'>
                <div className='w-full md:pr-5'>
                    <h1 className='text-25px font-Poppins font-[600]'>
                        {courseData?.name}
                    </h1>
                    <div className='flex items-center justify-between pt-3 '>
                        <div className='flex items-center   '>
                            <Ratings rating={0} />
                            <h5> 0 Đánh giá</h5>
                        </div>

                        <h5> 0 Học viên</h5>
                    </div>
                    <br />
                    <h1 className='text-[25px] font-Poppins font-600'>
                    Bạn sẽ học được gì từ khóa học này
                    </h1>
                </div>
                
                {courseData?.benefits?.map((item:any, index:number) => (
                    <div className='w-full flex md:items-center py-2' key={index}>
                        <div className='w-[15px] mr-1'>
                            <IoMdCheckmarkCircleOutline 
                                size={20}
                            />
                        </div>
                        <p className='pl-2'>{item.title}</p>
                    </div>
                ))}
                <br />
                <br/>
                <h1 className='text-[25px] font-Poppins font-600'>
                những điều kiện tiên quyết để bắt đầu khóa học này là gì
                    </h1>
                    {courseData?.benefits?.map((item:any, index:number) => (
                    <div className='w-full flex md:items-center py-2' key={index}>
                        <div className='w-[15px] mr-1'>
                            <IoMdCheckmarkCircleOutline 
                                size={20}
                            />
                        </div>
                        <p className='pl-2'>{item.title}</p>
                    </div>
                ))}
                {/*course description */}
                 <div className='w-full'>
                    <h1 className='text-[25px] font-Poppins font-[600]'>
                    chi tiết khóa học
                    </h1>
                    {courseData?.description}
                </div>
                <br />  
                <br/> 
            </div>
            <div className='w-full flex items-center justify-between'>
                    <div className="w-[40%] h-[40px] bg-[#37a39a] text-center justify-center text-[#fff] rounded mt-8 cursor-pointer"
                        onClick={() => prevButton()}
                    >
                    Trước đó
                    </div>
                    <div className="w-[40%] h-[40px] bg-[#37a39a] text-center justify-center text-[#fff] rounded mt-8 cursor-pointer"
                        onClick={() => createCourse()}
                    >
                    {
                        isEdit ? 'Update' : 'Create'
                    }
                    </div>
            </div>
        </div>

    )
}

export default CoursePreview