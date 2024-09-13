import React, { useState, useEffect } from 'react'
import * as Tone from 'tone'
import '../../style.scss'
import StepSequencer from '../stepSequencer/StepSequencer'

export default function Synth0() {

  const [synth, setSynth] = useState<Tone.Synth | null>(null)
  const [bpm, setBpm] = useState(120)
  const [stepsNumber, setStepsNumber] = useState(5)

  let keys = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];

  useEffect(() => {
    // Initialize Tone.js Synth
    const newSynth = new Tone.Synth().toDestination()
    setSynth(newSynth)

    return () => {
      // Clean up the synth when the component is unmounted
      newSynth.dispose()
    }
  }, [])

  return (
    <div className='w-full h-full flex flex-col items-start gap-5'>

      <div className='center gap-10'>
        <div className='center gap-2'>
          <input
            type="text"
            className="generalInput"
            style={{ width: '3rem', textTransform: 'uppercase' }}
            maxLength={3}
            value={bpm}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              let value = input.value;

              // Filter out non-numeric characters and numbers outside 0-8
              value = value.replace(/[^0-9]/g, '');

              if (value.length > 3) { // Limit the length of the numeric part
                value = value.substring(0, 3);
              }

              input.value = value;

              setBpm(Number(input.value))

            }}
          />
          <span>bpm</span>
        </div>
        <div className='center gap-2'>
        <span>steps number</span>

          <input
            type="text"
            className="generalInput"
            style={{ width: '3rem', textTransform: 'uppercase' }}
            maxLength={2}
            value={stepsNumber}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              let value = input.value;

              // Filter out non-numeric characters and numbers outside 0-8
              value = value.replace(/[^0-9]/g, '');

              if (value.length > 2) { // Limit the length of the numeric part
                value = value.substring(0, 2);
              }

              input.value = value;

              setStepsNumber(Number(input.value))

            }}
          />
        </div>
      </div>
      {synth && <StepSequencer keys={keys} synth={synth} bpm={bpm} stepsNumber={stepsNumber}/>}
    </div>
  )
}