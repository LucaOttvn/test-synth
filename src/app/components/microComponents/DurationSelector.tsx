import React, { useEffect, useState } from 'react';

interface DurationSelectorProps {
    updateStep: Function,
    selectedStepValue: number,
}

export default function DurationSelector(props: DurationSelectorProps) {

    const durations = [1, 2, 4, 8, 16, 32, 64]

    const [currentDuration, setCurrentDuration] = useState(0)

    useEffect(() => {
      props.updateStep(durations[currentDuration], 'duration')
    }, [currentDuration]);

    return (
        <div className='center gap-2'>
            <div className='generalButton' onClick={()=>{
                if (currentDuration > 0) setCurrentDuration(currentDuration -1)
            }}>-</div>
            <span className='px-2 text-center' style={{border: 'solid 1px var(--green)', width: '3rem'}}>{'1/' + props.selectedStepValue}</span>
            <div className='generalButton' onClick={()=>{
                if (currentDuration < durations.length -1) setCurrentDuration(currentDuration + 1)
            }}>+</div>
        </div>
    );
}