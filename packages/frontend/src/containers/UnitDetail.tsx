import {UnitType} from "../types/unit.ts";
import {Table} from "react-bootstrap";

interface UnitProps {
    unit?: UnitType
}

export default function UnitDetail( props : UnitProps) {
    // Not display Data Issues yet
    let unit = props.unit

    function renderField(fieldName?: string, fieldValue?: string|number) {
            if (fieldValue) {
                    return (
                        <><b>{fieldName}</b>: {fieldValue}<br/></>
                    )
            }
            return (
                <></>
            )
    }

    return (
        <>
            {renderField('Chassis', unit?.chassis)}
            {renderField('Variant', unit?.variant)}
            {renderField('Mass', unit?.tons)}
            {renderField('BV', unit?.bv)}
            {renderField('PV', unit?.pv)}
            {renderField('Role', unit?.role)}
            {renderField('Rules', unit?.rules)}
            {renderField('Introduction', unit?.intro)}
            {renderField('Config', unit?.config)}
            {renderField('Tech', unit?.techbase)}
            {renderField('Engine', unit?.engine)}
            {renderField('Internal Structure',unit?.structure)}
            {renderField('Myomer', unit?.myomer)}
            {renderField('Cockpit', unit?.cockpit)}
            {renderField('Gyro', unit?.gyro)}
            {renderField('Ejection', unit?.ejection)}
            {renderField('Heat Sinks', unit?.heatSinks)}
            {renderField('Walk MP', unit?.walkMP)}
            {renderField('Jump MP', unit?.jumpMP)}
            {renderField('Armor Type', unit?.armorType)}
            {renderField('Armor Points', unit?.armorPoints)}
            <b>Weapons:</b>
                <Table id="weaponTable" striped bordered hover size="sm" responsive="sm">
                {
                    unit?.weapons?.map( (weapon) => {
                    return (

                        <tr>
                            <th>{weapon.type}</th>
                            <th>{weapon.location}</th>
                            <th>{weapon.ammo}</th>
                        </tr>
                        )
                    })
                }
                </Table>
        </>
    )
}