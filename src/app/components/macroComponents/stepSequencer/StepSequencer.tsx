import React, { useEffect, useState } from 'react';
import './style.scss'
import * as Tone from 'tone'
import InputRange from '../../microComponents/inputs/InputRange';
import gsap from 'gsap';
import DurationSelector from '../../microComponents/DurationSelector';
import { Step } from '@/app/context';


interface StepSequencerProps {
    synth: Tone.Synth
    keys: string[]
    bpm: number
    stepsNumber: number
}


export default function StepSequencer(props: StepSequencerProps) {

    const [steps, setSteps] = useState<Step[]>([]);
    const [selectedStep, setSelectedStep] = useState<number>();
    const [currentStep, setCurrentStep] = useState<number>();
    const [savedSequences, setSavedSequences] = useState<Step[][]>(JSON.parse(localStorage.getItem('savedSequences') ?? '[]'))


    useEffect(() => {
        // Initialize steps with 10 items
        setSteps(Array.from({ length: props.stepsNumber }, (_, i) => ({ sharp: false, duration: 1 })));
    }, [props.stepsNumber]);

    // handle selected step effect
    useEffect(() => {
        steps.forEach((step, index) => {
            gsap.set('#step' + index, {
                background: selectedStep == index ? 'var(--green)' : 'var(--black)',
                color: selectedStep == index ? 'var(--black)' : 'var(--green)'
            })
        })
    }, [selectedStep]);

    useEffect(() => {
        localStorage.setItem('savedSequences', JSON.stringify(savedSequences))
    }, [savedSequences]);


    function updateStep(value: string | number | boolean, prop: string) {
        setSteps((prevState) => {
            const updatedSteps = [...prevState];

            // Initialize the selected step with `sharp: false` if it's not defined
            if (selectedStep && !updatedSteps[selectedStep!].note) {
                updatedSteps[selectedStep!] = { ...updatedSteps[selectedStep!], sharp: false };
            }

            // Update the property with the new value
            updatedSteps[selectedStep!] = { ...updatedSteps[selectedStep!], [prop]: value };

            return updatedSteps;
        });
    }

    function scheduleNotes(steps: Step[]) {
        let time = Tone.now(); // Start scheduling from the current time

        steps.forEach(step => {
            const note = step.note + (step.sharp ? '#' : '') + step.octave;
            const duration = step.duration;

            console.log(duration)

            Tone.getTransport().schedule((t) => {
                handlePlay(t, note, duration! + 'n');
            }, time);

            time += Tone.Time(duration + 'n').toSeconds(); // Increment time by the duration of the note
        });
    }

    function handlePlay(time: number, note: string, duration: string) {
        if (props.synth) {
            props.synth.triggerAttack(note, time);
            props.synth.triggerRelease(time + Tone.Time(duration).toSeconds());
        }
    }

    function handlePlayClick() {
        // Ensure the Transport is started
        Tone.start().then(() => {

            Tone.getTransport().bpm.value = props.bpm;
            // Schedule the notes when the button is clicked
            scheduleNotes(steps);
            Tone.getTransport().start(); // Start the transport
        });
    };

    return (
        <div className='stepSequencer'>
            {/* steps section */}
            <div className='center gap-5'>
                <div className='stepsContainer center flex-wrap'>
                    {steps && steps.map((step, stepIndex) => {
                        return <div key={'step' + stepIndex} id={'step' + stepIndex} className="step" onClick={() => {
                            setSelectedStep(stepIndex)
                        }}>
                            {steps[stepIndex].note ? (
                                <div className='w-full center'>
                                    {/* Render the note first */}
                                    <span>{steps[stepIndex].note}</span>

                                    {/* Conditionally render the sharp symbol after the note */}
                                    {steps[stepIndex].sharp && <span>#</span>}

                                    {/* Render other keys except duration and sharp */}
                                    {Object.keys(steps[stepIndex]).map((key) => {
                                        if (key !== 'note' && key !== 'duration' && key !== 'sharp') {
                                            return <span key={key}>{steps[stepIndex][key as keyof Step]}</span>;
                                        }
                                    })}
                                </div>
                            ) : (
                                <span>{stepIndex + 1}</span>
                            )}
                            <div>{'1/' + steps[stepIndex].duration}</div>

                        </div>
                    })}
                </div>
                {/* play button */}
                <div className='generalButton px-2'
                    onClick={() => {
                        handlePlayClick()
                    }}
                >Play</div>
                <div className='generalButton px-2'
                    onClick={() => {
                        setSavedSequences(prevState => [...prevState, steps])
                    }}>
                    Save sequence
                </div>

            </div>
            {/* note editor section */}
            {selectedStep != undefined && steps[selectedStep] != undefined && <div className='flex flex-col justify-start'>
                <span>Note editor</span>
                <div className='inputsContainer'>

                    {/* note */}
                    <div className='flex flex-col items-center'>
                        <span>Note</span>
                        <input type="text" className='generalInput' style={{ width: '2rem', textTransform: 'uppercase' }}
                            value={steps[selectedStep].note ?? ''}
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
                    {(steps[selectedStep].note === 'C' || steps[selectedStep].note === 'D' ||
                        steps[selectedStep].note === 'F' || steps[selectedStep].note === 'G' ||
                        steps[selectedStep].note === 'A') && <div className='start flex-col gap-3'>
                            <span>#Sharp</span>
                            <label className="customSwitch">
                                <input
                                    type="checkbox"
                                    checked={steps[selectedStep].sharp ?? false} // Ensure proper default value
                                    onChange={e => { updateStep((e.target as HTMLInputElement).checked, 'sharp') }}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>}

                    {/* octave */}
                    <div className='flex flex-col items-center'>
                        <span>Octave</span>
                        <input
                            type="text"
                            className="generalInput"
                            style={{ width: '2rem', textTransform: 'uppercase' }}
                            maxLength={1}
                            value={steps[selectedStep].octave ?? ''}
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
                        <DurationSelector updateStep={updateStep} selectedStepValue={steps[selectedStep].duration!} />
                    </div>
                </div>
            </div>}

            {/* saved sequences list */}
            {savedSequences.length > 0 && <div className='flex flex-col justify-start items-start gap-2'>
                <span>Saved sequences</span>
                {savedSequences.map((sequence, sequenceIndex) => {
                    return (
                        <div key={'savedSequence' + sequenceIndex} className='center gap-3' style={{ cursor: 'pointer' }}>
                            <span onClick={() => {
                                setSteps(sequence)
                            }}>
                                - Sequence {sequenceIndex + 1}
                            </span>
                            <span className='generalButton px-2'
                                onClick={() => {
                                    savedSequences.slice(sequenceIndex, 1)
                                    setSavedSequences((prevArray) => prevArray.filter((_, index) => index !== sequenceIndex))
                                }}>
                                Delete
                            </span>
                        </div>
                    )
                })}
            </div>}
        </div>
    );
}

