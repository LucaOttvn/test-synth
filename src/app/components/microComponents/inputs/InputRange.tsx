import React from 'react';
import './style.scss'

interface InputRangeProps { }

export default function InputRange(props: InputRangeProps) {
  return (
    <>
      <input type="range" name="" id="" min={0} max={100} step={16.66} />

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