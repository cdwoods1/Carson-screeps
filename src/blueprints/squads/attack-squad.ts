import { CreepTypes } from "blueprints/creeps/squadron-creep.types";

export class Squads {
    public static baseAttackSquad: CreepTypes[][] = [
        ["ranger", "healer"  , "bruiser"],
        ["healer", "ranger"  , "bruiser"],
        ["ranger", "healer"  , "bruiser"],
    ]
}
