import React from 'react';
import './style.scss'

interface InputRangeProps {
  updateStep: any,
  durations: number[]
}

export default function InputRange(props: InputRangeProps) {


  return (
    <>
      <input type="range" name="" id="" min={0} max={100} step={16.66} defaultValue={0}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          const value = Number(target.value);
          const min = Number(target.min);   
          const step = Number(target.step); 
          const stepIndex = (value - min) / step
          props.updateStep(props.durations[stepIndex], 'duration')
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