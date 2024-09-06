
export class Controller {
    public static run(controller: StructureController): void {
        const closestContainer: StructureContainer | null = controller.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER;
            }
        });

        // Save the closest container to the controller in memory.
        if(closestContainer) {
            Game.rooms[controller.room.name].memory.closestContainer = closestContainer.id;
        }
    }
}
