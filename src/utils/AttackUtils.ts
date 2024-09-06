const TEAMMATES = ["ridigilis"];
export const isFriendlyOwner = (owner: any) => { return TEAMMATES.includes(owner.username)};
