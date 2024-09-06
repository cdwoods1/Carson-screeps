const TEAMMATES = ["dreamlane", "ridigilis", "legendeck", "Breadboard"];
export const isFriendlyOwner = (owner: any) => { return TEAMMATES.includes(owner.username)};
