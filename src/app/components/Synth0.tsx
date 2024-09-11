import React, { useState, useEffect } from 'react'
import * as Tone from 'tone'
import './style.scss'

export default function Synth0() {
  const [isPlaying, setIsPlaying] = useState(false)
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

  function handlePlay(note: string) {
    if (synth) {
      synth.triggerAttackRelease(note, '4n')
      setIsPlaying(true)
    }
  }

  function stop() {
    if (synth) {
      synth.triggerRelease()
    }
  }

  return (
    <div className='w-full center gap-5'>
      {keys.map((key, index) => {
        return <div key={index} className='key' onClick={() => {
          handlePlay(key)
        }}>{key}</div>
      })}
      <div className='generalButton' onClick={()=>{
        stop()
      }}>
        Stop
      </div>
    </div>
  )
}