import React, { useState } from 'react'
import DashboardHeader from "./DashboardHeader"
import DashboarWidgtes from "../../components/Admin/Widgets/DashboarWidgtes"


type Props = {
    isDashboard?: boolean;
}

const DashboarHero = ({isDashboard}: Props) => {
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

export default DashboarHero