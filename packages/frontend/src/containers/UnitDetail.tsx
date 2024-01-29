import {UnitType} from "../types/unit.ts";

interface UnitProps {
    unit?: UnitType
}

export default function UnitDetail( props : UnitProps) {
    // Not display Data Issues yet
    let unit = props.unit
    return (
        <>
            Chassis: {unit?.chassis}<br/>
            Variant: {unit?.variant}<br/>
            Mass: {unit?.tons}<br/>
            BV: {unit?.bv}<br/>
            PV: {unit?.pv}<br/>
            Role: {unit?.role}<br/>
            Rules: {unit?.rules}<br/>
            Introduction: {unit?.intro}<br/>
            Config: {unit?.config}<br/>
            Tech: {unit?.techbase}<br/>
            Engine: {unit?.engine}<br/>
            Internal Structure: {unit?.structure}<br/>
            Myomer: {unit?.myomer}<br/>
            Cockpit: {unit?.cockpit}<br/>
            Gyro: {unit?.gyro}<br/>
            Ejection: {unit?.ejection}<br/>
            Heat Sinks: {unit?.heatSinks}<br/>
            Walk MP: {unit?.walkMP}<br/>
            Jump MP: {unit?.jumpMP}<br/>
            Armor Type: {unit?.armorType}<br/>
            Armor Points: {unit?.armorPoints}<br/>
            Weapons:<br/> {
                unit?.weapons?.map( (weapon) => {
                    return (
                        <>
                            {weapon.type}<br/>
                        </>
                    )
                })
            }
        </>
    )
}