import { BlueprintFlag } from "./blueprint.types";

export class ExtensionSqare {
    public readonly blueprintType = "extensionSquare";
    public readonly blueprint: BlueprintFlag[][] = [
        ['extension', 'extension', 'extension', 'ground'   , 'extension', 'extension', 'extension'],
        ['extension', 'road'     , 'extension', 'extension', 'extension', 'road'     , 'extension'],
        ['extension', 'extension', 'road'     , 'extension', 'road'     , 'extension', 'extension'],
        ['ground'   , 'extension', 'extension', 'flag'     , 'extension', 'extension', 'ground'   ],
        ['extension', 'extension', 'road'     , 'extension', 'road'     , 'extension', 'extension'],
        ['extension', 'road'     , 'extension', 'extension', 'extension', 'road'     , 'extension'],
        ['extension', 'extension', 'extension', 'ground'   , 'extension', 'extension', 'extension']
    ]
}
