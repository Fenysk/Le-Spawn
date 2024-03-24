export class GameResponseDto {
    name: string;
    platform: string;
    edition: string; // 'Standard' by default.
    region: string; // 'NTSC', 'PAL', ...
    hasBox: boolean;
    hasGame: boolean;
    stateBox: string | null; // 'PARTS', 'BAD', 'AVERAGE', 'GOOD', 'MINT'.
    stateGame: string | null;
    extraContent: {
        name: string; // in ${language}.
        type: string; // in ${language}.
        state: string;
    }[]; // Can be empty.
    description: string; // little item description <160 characters, in ${language}.
}