import React from 'react';
import './style.scss'

interface InputRangeProps {
  updateStep: any,
  durations: number[]
}

export default function InputRange(props: InputRangeProps) {


  return (
    <>
      <input type="range" name="" id="" min={0} max={100} step={16.66}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          const value = Number(target.value); // Convert to number
          const min = Number(target.min);    // Convert to number
          const step = Number(target.step);  // Convert to number

          const stepIndex = (value - min) / step

          props.updateStep(props.durations[stepIndex], 'duration')



          console.log('Current step:', stepIndex);
        }} />

      <div className='rangeTacklesContainer'>
        <span>1/1</span>
        <span>1/2</span>
        <span style={{ transform: 'translateX(5px)' }}>1/4</span>
        <span style={{ transform: 'translateX(5px)' }}>1/8</span>
        <span style={{ transform: 'translateX(5px)' }}>1/16</span>
        <span style={{ transform: 'translateX(4px)' }}>1/32</span>
        <span>1/64</span>
      </div>
    </>
  );
}