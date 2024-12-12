import { Style } from '@/app/style/stylelogin';
import React, { FC } from 'react'
import toast from 'react-hot-toast';
import { AiFillPlusCircle } from 'react-icons/ai';

type Props = {
    benefits: {title:string}[];
    setBenefits: (benefits: {title:string}[]) => void;
    prerequisites: {title:string}[];
    setPrerequisites : (prerequisites: {title:string}[]) => void;
    active:number;
    setActive: (active:number) => void;
}

const CourseData:FC<Props> = ({
    benefits,
    setBenefits,
    prerequisites,
    setPrerequisites,
    active,
    setActive,
}) => {

    const handleBenefitChange = (index:number, value:any) => {
        const updateBenfits = [...benefits];
        updateBenfits[index].title = value;
        setBenefits(updateBenfits);
    };

    const handleAddBenefit = () => {
        setBenefits([...benefits, {title: ""}]);
    };

    const handlePrerequisitesChange = (index: number, value: any) => {
        // Tạo bản sao của mảng prerequisites để không thay đổi trực tiếp state
        const updatedPrerequisites = [...prerequisites];
        // Cập nhật title của phần tử tại index
        updatedPrerequisites[index].title = value;
        // Cập nhật lại state
        setPrerequisites(updatedPrerequisites);
    };

    const handleAddPrerequisites = () => {
        // Thêm một phần tử mới vào prerequisites
        setPrerequisites([...prerequisites, { title: "" }]);
    };

   const  prevButton = () => {
        setActive(active - 1 )
   }

   const handleOptions= () => {
        if(benefits[benefits.length -1]?.title !== "" && prerequisites[prerequisites.length -1 ]?.title !== ""){
        setActive(active  + 1 );
        }else{
            toast.error("Pleasse fill the fiels for go to next!");
        }



   }

    return ( 
        <div className='w-[80%] m-auto mt-24 block'>
            <div>
                <label className={`${Style.Label} text-[20px]`} htmlFor='email'>
                Lợi ích của học viên trong khóa học này là gì
                </label>
                <br />
                {
                    benefits.map((benefits:any ,index:number) => (
                        <input
                            type='text'
                            key={index}
                            name='Benefit'
                            placeholder='bạn sẽ có thể xây dựng Nền tảng kiến thức đầy đủ...'
                            required
                            className={`${Style.input} my-2`}
                            value={benefits.title}
                            onChange={(e) => handleBenefitChange(index, e.target.value)} 
                        />
                    ))
                }
                <AiFillPlusCircle
                    style={{margin: "10px 0px ", cursor:"pointer", width: "30px", fontSize: "25px" }}
                    onClick={handleAddBenefit}
                />
            </div>
            <div>
                <label className={`${Style.Label} text-[20px]`} htmlFor='email'>
                điều kiện tiên quyết của học viên trong khóa học này là gì
                </label>
                <br />
                {
                    prerequisites.map((prerequisites:any ,index:number) => (
                        <input
                            type='text' 
                            key={index}
                            name='Prerequisites'
                            placeholder='bạn cần có kiến ​​thức cơ bản về MERN stack...'
                            required
                            className={`${Style.input} my-2`}
                            value={prerequisites.title}
                            onChange={(e) => handlePrerequisitesChange(index, e.target.value)} 
                        />
                    ))
                }
                <AiFillPlusCircle
                    style={{margin: "10px 0px ", cursor:"pointer", width: "30px", fontSize: "25px" }}
                    onClick={handleAddPrerequisites}
                />
            </div>
            <div className='w-full flex items-center justify-between'>
                <div className="w-[45%] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
                    onClick={() => prevButton()}
                >
                Trước đó
                </div>
                <div className="w-[45%] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
                    onClick={() => handleOptions()}
                >
                Kế tiếp
                </div>
            </div>
        </div>
    )
}

export default CourseData