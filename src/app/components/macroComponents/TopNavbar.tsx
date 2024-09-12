import { log } from 'console';
import React, { useEffect } from 'react';

interface TopNavbarProps {
    setCurrentSynth: React.Dispatch<React.SetStateAction<number>>;
    synthsLength: number
}

export default function TopNavbar(props: TopNavbarProps) {

    const numbersArray = Array.from({ length: props.synthsLength }, (_, index) => index + 1);

    return (
        <div className='topNavbar'>
            {numbersArray.map((synth, index) => {
                return (<div key={'synthBtn' + index} className='center'>

                    <div style={{ width: '5rem', cursor: 'pointer' }}
                        onClick={() => {
                            props.setCurrentSynth(index)
                        }}>Synth {index + 1}</div>

                    {index != (numbersArray.length - 1) && <div className='verticalDivider'></div>}

                </div>)
            })}
        </div>
    );
}

