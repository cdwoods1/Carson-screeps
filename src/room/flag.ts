import { AutoSpawn } from "autospawn";
import { SpawnUtils } from "utils/SpawnUtils";

export class FlagHandler {
    public static run(flag: Flag): void {
        switch(flag.color) {
            case COLOR_RED:
                this.handleRedFlag(flag);
                break;
            case COLOR_GREEN:
                this.handleGreenFlag(flag);
                break;
            case COLOR_BLUE:
                this.handleBlueFlag(flag);
                break;
            case COLOR_YELLOW:
                this.handleYellowFlag(flag);
                break;
            case COLOR_ORANGE:
                this.handleOrangeFlag(flag);
                break;
            case COLOR_PURPLE:
                this.handlePurpleFlag(flag);
                break;
            case COLOR_CYAN:
                this.handleCyanFlag(flag);
                break;
            case COLOR_WHITE:
                this.handleWhiteFlag(flag);
                break;
        }
    }

    private static handleRedFlag(flag: Flag): void {
        console.log("Handling red flag");
    }

    private static handleGreenFlag(flag: Flag): void {
        console.log("Handling green flag");
    }

    private static handleBlueFlag(flag: Flag): void {
        const creepID = flag.memory.sentryCreepID;
        const roomName = flag.room?.name;
        if(!roomName) {
            return;
        }
        if(creepID) {
            const creep = Game.getObjectById(creepID) as Creep;

            if(!creep) {
                AutoSpawn.run('rangedAttacker', roomName);
            }

            if(creep.ticksToLive < 100) {
                SpawnUtils.getBodyPartsForArchetype('rangedAttacker');
            }

        } else {

        }




        // Get a sentry.

        console.log("Handling blue flag");
    }

    private static handleYellowFlag(flag: Flag): void {
        console.log("Handling yellow flag");
    }

    private static handleOrangeFlag(flag: Flag): void {
        console.log("Handling orange flag");
    }

    private static handlePurpleFlag(flag: Flag): void {
        console.log("Handling purple flag");
    }

    private static handleCyanFlag(flag: Flag): void {
        console.log("Handling cyan flag");
    }

    private static handleWhiteFlag(flag: Flag): void {
        console.log("Handling white flag");
    }
}
