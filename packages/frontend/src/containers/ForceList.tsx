import {Offcanvas, Table} from "react-bootstrap"
import {calculateBV} from "../lib/battletech.ts"
import Button from "react-bootstrap/Button"
import {FaMinus} from "react-icons/fa"
import {ForceType, ForceUnit} from "../types/force.ts"

interface ForceListProps {
    showForce: boolean
    force: ForceType
    handleHideForce: ()=>void
    removeUnitFromForce: (fUnit: ForceUnit) => void
}

export default function ForceList( props : ForceListProps) {
    let { showForce, force, handleHideForce, removeUnitFromForce } = props

    return (
        <Offcanvas show={showForce} onHide={handleHideForce} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Force Builder</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                Units:{force.units.length}
                <Table id="forceTable" striped bordered hover size="sm" responsive="sm">
                    <thead>
                    <tr>
                        <th>Unit</th>
                        <th>Skill</th>
                        <th>BV (?/?)</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>


                    { force.units.map( (forceUnit) => {
                        return (
                            <tr key={forceUnit.id}>
                                <td>{forceUnit.unit.mechName}</td>
                                <td>{forceUnit.gunnerySkill}/{forceUnit.pilotSkill}</td>
                                <td>{calculateBV(forceUnit.unit.bv || '0', forceUnit.gunnerySkill, forceUnit.pilotSkill)}</td>
                                <td><Button size="sm" onClick={()=>removeUnitFromForce(forceUnit)}><FaMinus/></Button></td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Total</td>
                        <td>{force.calculateBV()}</td>
                    </tr>
                    </tbody>
                </Table>
            </Offcanvas.Body>
        </Offcanvas>
    )
}