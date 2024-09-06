export class Claimer {
    public static run(creep: Creep) {
        const flag = Game.flags.ImmigrantDestination;
        if(creep.room !== flag.room) {
            creep.moveTo(flag, {visualizePathStyle: {stroke: '#ff0000'}});
        } else {
            if(creep.room.controller) {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }

}
