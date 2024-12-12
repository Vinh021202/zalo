import React, { useState } from 'react'
import DashboardHeader from '../Teacher/DashboardHeader';
import DashboarWidgtes from '../../components/Teacher/Widgets/DashboarWidgtes';



type Props = {
    isDashboard?: boolean;
}

const TeacherDashHero = ({isDashboard}: Props) => {
    const[open, setOpen] = useState(false);

    return ( 
        <div>
             <DashboardHeader open={open} setOpen={setOpen} />
              {
            isDashboard && (
                <DashboarWidgtes open={open} />
            )
        }
        </div>
    );
}

export default TeacherDashHero