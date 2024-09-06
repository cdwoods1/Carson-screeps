export type BlueprintFlag = 'flag' | 'road' | 'extension' | 'ground';

export class BluePrints {
    public static extensionSquare: BlueprintFlag[][] = [
        ['extension', 'extension', 'extension', 'ground'   , 'extension', 'extension', 'extension'],
        ['extension', 'road'     , 'extension', 'extension', 'extension', 'road'     , 'extension'],
        ['extension', 'extension', 'road'     , 'extension', 'road'     , 'extension', 'extension'],
        ['ground'   , 'extension', 'extension', 'flag'     , 'extension', 'extension', 'ground'   ],
        ['extension', 'extension', 'road'     , 'extension', 'road'     , 'extension', 'extension'],
        ['extension', 'road'     , 'extension', 'extension', 'extension', 'road'     , 'extension'],
        ['extension', 'extension', 'extension', 'ground'   , 'extension', 'extension', 'extension']
    ]
}
