export class MovementUtils {
    private static DIRECTIONS_ARRAY = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
    public static randomDirectionSelector(): DirectionConstant {
        return MovementUtils.DIRECTIONS_ARRAY[Math.floor(Math.random() * MovementUtils.DIRECTIONS_ARRAY.length)];
    }
}
