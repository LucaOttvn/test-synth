'use client'
import { useEffect, useState } from "react";
import Synth0 from "./components/Synth0";
import Synth1 from "./components/Synth1";
import TopNavbar from "./components/TopNavbar";
import TerminalInputTxt from "./components/inputs/TerminalInputTxt";

export default function Home() {
  let synths: React.JSX.Element[] = [<Synth0/>, <Synth1/>]
  const [currentSynth, setCurrentSynth] = useState(1)

  return (
    <div className="w-full h-full flex flex-col justify-between items-start p-5 gap-10" style={{borderRight: 'solid 1px var(--black)'}}>
      <TopNavbar setCurrentSynth={setCurrentSynth} synthsLength={synths.length}/>
      {synths[currentSynth]}
      <TerminalInputTxt/>
    </div>
  );
}
