export class FlagUtils {
    public static getFlagMemory(flag: Flag): FlagMemory {
        if (!Memory.flags) {
            Memory.flags = {};
        }
        if (!Memory.flags[flag.name]) {
            Memory.flags[flag.name] = {};
        }
        return Memory.flags[flag.name];
    }


    public static clearFlagMemory(flag: Flag): void {
        delete Memory.flags[flag.name];
    }
    public static isFlagMemorySet(flag: Flag): boolean {
        return !!Memory.flags[flag.name];
    }

    public static clearAllFlagMemory(): void {
        Memory.flags = {};
    }
}
