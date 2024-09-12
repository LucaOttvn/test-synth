import React, { useEffect, useState } from 'react';
import './style.scss'
import * as Tone from 'tone'
import InputRange from '../../microComponents/inputs/InputRange';


interface StepSequencerProps {
    synth: Tone.Synth,
    keys: string[]
}

interface Step {
    note: string,
    duration: string,
    sharp: boolean,
}

export default function StepSequencer(props: StepSequencerProps) {

    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [steps, setSteps] = useState<Step[]>([]);
    const [duration, setDuration] = useState<Step[]>([]);
    const [currentStep, setCurrentStep] = useState<Step>({ note: '', duration: '', sharp: false });

    useEffect(() => {
        // Initialize steps with 10 items
        setSteps(Array.from({ length: 10 }, (_, i) => ({ note: '', duration: '', sharp: false })));
    }, []);

    function handlePlay(note: string) {
        if (props.synth) {
            props.synth.triggerAttackRelease(note, '4n')
        }
    }

    // Function to start the interval
    const startInterval = () => {
        if (intervalId) return; // Prevent starting multiple intervals

        const id = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * props.keys.length);
            handlePlay(props.keys[randomIndex]);
        }, 500);

        setIntervalId(id);
    };

    // Function to stop the interval
    const stopInterval = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    // Clean up interval on component unmount
    React.useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);


    return (
        <div className='stepSequencer'>
            <div className='stepsContainer center'>
                {steps && steps.map((step, stepIndex) => {
                    return <div key={'step' + stepIndex} className="step">
                        {stepIndex + 1}
                    </div>
                })}
            </div>
            <div className='flex flex-col justify-start'>
                <span>Note editor</span>
                <div className='inputsContainer'>

                    {/* note */}
                    <div className='flex flex-col items-center'>
                        <span>Note</span>
                        <input type="text" className='generalInput' style={{ width: '2rem', textTransform: 'uppercase' }}
                            maxLength={1}
                            onInput={(e) => {
                                const validChars = 'CDEFGAB';
                                const target = e.target as HTMLInputElement
                                const value = target.value.toUpperCase();
                                if (validChars.includes(value)) {
                                    target.value = value;
                                } else {
                                    target.value = '';
                                }
                            }}
                        />
                    </div>

                    {/* sharp */}
                    <div className='start flex-col gap-3'>
                        <span>#Sharp</span>
                        <label className="customSwitch">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>

                    {/* octave */}
                    <div className='flex flex-col items-center'>
                        <span>Octave</span>
                        <input
                            type="text"
                            className="generalInput"
                            style={{ width: '2rem', textTransform: 'uppercase' }}
                            maxLength={1}
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                let value = input.value;

                                // Filter out non-numeric characters and numbers outside 0-8
                                value = value.replace(/[^0-8]/g, '');

                                if (value.length > 2) { // Limit the length of the numeric part
                                    value = value.substring(0, 2);
                                }

                                input.value = value;
                            }}
                        />
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col start gap-1">
                        <span>Duration</span>
                        <InputRange/>
                    </div>
                </div>
            </div>
        </div>
    );
}