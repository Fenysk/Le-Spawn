export class ResponseDto {
    type: string; // 'GAME', 'CONSOLE', ...
    game: {
        name: string;
        platform: string;
        edition: string; // 'Standard' by default.
        region: string; // 'NTSC', 'PAL', ...
        hasBox: boolean;
        hasGame: boolean;
        stateBox: string | null; // 'PARTS', 'BAD', 'AVERAGE', 'GOOD', 'MINT'.
        stateGame: string | null;
        extraContent: {
            name: string; // in ${language}
            type: string; // in ${language}
            state: string;
        }[] | null;
        description: string; // ~150 characters, in ${language}.
    } | null;
    console: {
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
    } | null;
    manga: {
        name: string;
        volume: number;
        publisher: string;
        state: string; // 'PARTS', 'BAD', 'AVERAGE', 'GOOD', 'MINT'.
        description: string; // ~150 characters, in ${language}.
    } | null;
}