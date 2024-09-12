'use client'
import { useEffect, useState } from "react";
import Synth0 from "./components/macroComponents/synths/Synth0";
import Synth1 from "./components/macroComponents/synths/Synth1";
import TopNavbar from "./components/macroComponents/TopNavbar";
import TerminalInputTxt from "./components/microComponents/inputs/TerminalInputTxt";


export default function Home() {
  let synths: React.JSX.Element[] = [<Synth0 key='synth0'/>, <Synth1 key='synth1'/>]
  const [currentSynth, setCurrentSynth] = useState(0)
  
  return (
    <div className="w-full h-full flex flex-col justify-between items-start p-5 gap-10" style={{borderRight: 'solid 1px var(--black)'}}>
      <TopNavbar setCurrentSynth={setCurrentSynth} synthsLength={synths.length}/>
      {synths[currentSynth]}
      {/* <TerminalInputTxt/>     */}
    </div>
  );
}
