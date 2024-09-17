export function terminalCmdsHandler(cmd: string) {
    console.log(cmd);
}

export interface Step {
    note?: string,
    sharp: boolean,
    octave?: number,
    duration: number,
}