
export class Container {
    public static run(container: StructureContainer): void {
        const fullestContainerID = Game.rooms[container.room.name].memory.fullestContainerID;
        const currentEnergy = container.store.energy;

        if(fullestContainerID) {
            const fullestContainer = Game.getObjectById(fullestContainerID);
            if(!fullestContainer) {
                delete Game.rooms[container.room.name].memory.fullestContainerID;
                return;
            }
            const fullestContainerEnergy = fullestContainer.store.energy;
            const receivingContainerID = Game.rooms[container.room.name].memory.receivingContainerID;

            if(currentEnergy > fullestContainerEnergy && container.id !== receivingContainerID) {
                Game.rooms[container.room.name].memory.fullestContainerID = container.id;
            }
        } else {
            Game.rooms[container.room.name].memory.fullestContainerID = container.id;
        }
    }
}
