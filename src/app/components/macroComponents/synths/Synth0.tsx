import React, { useState, useEffect } from 'react'
import * as Tone from 'tone'
import '../../style.scss'
import StepSequencer from '../stepSequencer/StepSequencer'

export default function Synth0() {

  const [synth, setSynth] = useState<Tone.Synth | null>(null)

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

  function stop() {
    if (synth) {
      synth.triggerRelease()
    }
  }

  return (
    <div className='w-full h-full start flex-col gap-5'>
      {synth && <StepSequencer keys={keys} synth={synth} />}
    </div>
  )
}