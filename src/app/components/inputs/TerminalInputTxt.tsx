import React from 'react'
import './style.scss'
import { terminalCmdsHandler } from '../../context'

export default function TerminalInputTxt() {

    return (
        <div className='w-full center gap-5'>
            <input className='terminalInputTxt' placeholder='Prompt a command' onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    terminalCmdsHandler((event.target as HTMLInputElement).value)
                }
            }} />
        </div>
    )
}

