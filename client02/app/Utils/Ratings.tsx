
import React, { FC } from 'react'
import { AiFillAlert, AiOutlineStar } from 'react-icons/ai';
import { BsStarHalf } from 'react-icons/bs';

type Props = {
    rating: number;
}

const Ratings: FC<Props> = ({ rating }) => {
    const stars = [];

    // Corrected the loop condition to "i <= 5" instead of "i=5"
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(
                <AiFillAlert 
                    key={i}
                    size={20}
                    color="#f6b100"
                    className='mr-2 cursor-pointer'
                />
            );
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(
                <BsStarHalf 
                    key={i}
                    size={17}
                    color="#f6b100"
                    className='mr-2 cursor-pointer'
                />
            );
        } else {
            stars.push(
                <AiOutlineStar
                    key={i}
                    size={20}
                    color="#f6b100"
                    className='mr-2 cursor-pointer'
                />
            );
        }
    }

    return ( 
        <div className='flex mt-1 ml-2 md:mt-0 md:ml-0'>
            {stars}
        </div>
    );
}

export default Ratings;
