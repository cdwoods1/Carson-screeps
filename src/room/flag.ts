import { AutoSpawn } from "autospawn";
import { Squads } from "blueprints/squads/attack-squad";
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
        const blueprint = Squads.baseAttackSquad;
        const pos = flag.pos;

        let readyToAttack = true;
        for(let row = pos.x; row < pos.x + blueprint.length; row++) {
            for(let col = pos.y; col < pos.y + blueprint[0].length; col++) {
                // const type = blueprint[row - pos.x][col - pos.y];
                // const name = `${type}-${Game.time}`;
                // const bodyParts = SpawnUtils.getBodyPartsForArchetype(type, 300);
                // const options = {memory: {role: type}};

                // Game.spawns["Spawn1"].spawnCreep(bodyParts, name, options);
            }
        }

        console.log("Handling red flag");
    }

    private static handleGreenFlag(flag: Flag): void {
        console.log("Handling green flag");
    }

    private static handleBlueFlag(flag: Flag): void {
        const sentryCreepID = Game.flags[flag.name].memory.sentryCreepID;
        if(sentryCreepID) {
            const creep = Game.getObjectById(sentryCreepID);
            if(!creep) {
                delete Game.flags[flag.name].memory.sentryCreepID;
            }
        }
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
