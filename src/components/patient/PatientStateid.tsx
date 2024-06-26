import React from 'react'
import { PatientState } from '../type';

const PatientstateID = ({id, state }: PatientState) => {
    console.log(id,state);
    
    return (
        <div>PatientstateID</div>
    )
}

export default PatientstateID