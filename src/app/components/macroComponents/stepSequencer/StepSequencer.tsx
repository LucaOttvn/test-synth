import React, { useEffect, useState } from 'react';
import './style.scss'
import * as Tone from 'tone'
import InputRange from '../../microComponents/inputs/InputRange';
import gsap from 'gsap';


interface StepSequencerProps {
    synth: Tone.Synth,
    keys: string[]
}

interface Step {
    note?: string,
    sharp?: boolean,
    octave?: number,
    duration?: string,
}

export default function StepSequencer(props: StepSequencerProps) {

    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [steps, setSteps] = useState<Step[]>([]);
    const [duration, setDuration] = useState<Step[]>([]);
    const [currentStep, setCurrentStep] = useState<Step>();
    const [selectedStep, setSelectedStep] = useState<number>();

    const durations = [1,2,4,8,16,32,64]

    useEffect(() => {
        // Initialize steps with 10 items
        setSteps(Array.from({ length: 10 }, (_, i) => ({})));
    }, []);

    useEffect(() => {
        steps.forEach((step, index) => {
            gsap.set('#step' + index, {
                background: selectedStep == index ? 'var(--green)' : 'var(--black)',
                color: selectedStep == index ? 'var(--black)' : 'var(--green)'
            })
        })
    }, [selectedStep]);

    useEffect(() => {
        console.log(steps)
    }, [steps]);


    function updateStep(value: string | number | boolean, prop: string) {
        setSteps((prevState) => {
            const updatedSteps = [...prevState];
            updatedSteps[selectedStep!] = { ...updatedSteps[selectedStep!], [prop]: value };
            return updatedSteps;
        });
    }

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
                    return <div key={'step' + stepIndex} id={'step' + stepIndex} className="step" onClick={() => {
                        setSelectedStep(stepIndex)
                    }}>
                        {stepIndex + 1}
                    </div>
                })}
            </div>
            {selectedStep != undefined && <div className='flex flex-col justify-start'>
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

                                updateStep(target.value, 'note')

                            }}
                        />
                    </div>

                    {/* sharp */}
                    <div className='start flex-col gap-3'>
                        <span>#Sharp</span>
                        <label className="customSwitch">
                            <input type="checkbox" onInput={(e) => {
                                updateStep((e.target as HTMLInputElement).checked, 'sharp')
                            }} />
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

                                updateStep(input.value, 'octave')

                            }}
                        />
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col start gap-1">
                        <span>Duration</span>
                        <InputRange updateStep={updateStep} durations={durations}/>
                    </div>
                </div>
            </div>}
        </div>
    );
}