export interface WeaponType {
    type?: string;
    location?: string;
    ammo?: string;
}

export interface HeatSinks {
    type?: string;
    count?: number;
}

export interface UnitType {
    mechId?: string;
    mechName: string;
    chassis?: string;
    variant?: string;
    tons?: string;
    bv?: string;
    pv?: string;
    role?: string;
    rules?: string;
    intro?: string;
    dataIssues?: string[];
    config?: string;
    techbase?: string;
    source?: string;
    engine?: string;
    structure?: string;
    myomer?: string;
    cockpit?: string;
    gyro?: string;
    ejection?: string;
    heatSinks?: HeatSinks;
    walkMP?: string;
    jumpMP?: string;
    armorType?: string;
    armorPoints?: number;
    weapons?: WeaponType[];
}