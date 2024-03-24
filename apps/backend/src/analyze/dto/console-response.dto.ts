export class ConsoleResponseDto {
    name: string;
    manufacturer: string | null; // null if PC.
    generation: number | null; // null if PC.
    region: string | null; // 'NTSC', 'PAL', ...
    hasBox: boolean;
    hasConsole: boolean;
    hasCables: boolean;
    hasController: boolean;
    stateBox: string | null; // 'PARTS', 'BAD', 'AVERAGE', 'GOOD', 'MINT'.
    stateConsole: string | null;
    stateCables: string | null;
    stateController: string | null;
    extraContent: {
        name: string; // in ${language}
        type: string; // in ${language}
        state: string;
    }[] | null;
    description: string; // ~150 characters, in ${language}.
}