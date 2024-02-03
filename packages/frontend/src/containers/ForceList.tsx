import {Col, Form, Offcanvas, Row, Table} from "react-bootstrap"
import {calculateBV} from "../lib/battletech.ts"
import Button from "react-bootstrap/Button"
import {FaMinus} from "react-icons/fa"
import {ForceType, ForceUnit} from "../types/force.ts"


const Flechs_UnitDetail_URL = `https://sheets.flechs.net/?s=`

interface ForceListProps {
    showForce: boolean
    force: ForceType
    handleHideForce: ()=>void
    removeUnitFromForce: (fUnit: ForceUnit) => void
    updateForceUnitGunnery: (id: string, newSkill: number) => void
    updateForceUnitPiloting: (id: string, newSkill: number) => void
}

function parseDropDownAsNumber(e:  React.ChangeEvent<HTMLSelectElement>) {
    return parseInt(e.target.value || '0')
}

function buildFlechsURL(force: ForceType) {
    let mechNames = force.units.map( (fUnit: ForceUnit) => {
        return (fUnit.unit.mechName || '') + ','
    })

    return Flechs_UnitDetail_URL + mechNames
}

export default function ForceList( props : ForceListProps) {
    let { showForce, force, handleHideForce, removeUnitFromForce,
        updateForceUnitGunnery, updateForceUnitPiloting } = props

    return (
        <Offcanvas show={showForce} onHide={handleHideForce} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Force Builder</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <a href={buildFlechsURL(force)} target="_">Open in Flechs</a>
                <Table id="forceTable" striped bordered hover size="sm" responsive="sm">
                    <thead>
                    <tr>
                        <th>Unit</th>
                        <th>Skill (G/P)</th>
                        <th>BV</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>


                    { force.units.map( (forceUnit) => {
                        return (
                            <tr key={forceUnit.id}>
                                <td>{forceUnit.unit.mechName}</td>
                                <td>
                                    <Row>
                                        <Col>
                                            <Form.Select size="sm" value={forceUnit.gunnerySkill}
                                                onChange={ (e) => updateForceUnitGunnery(forceUnit.id, parseDropDownAsNumber(e))}>
                                                <option>0</option><option>1</option><option>2</option>
                                                <option>3</option><option>4</option><option>5</option>
                                                <option>6</option><option>7</option><option>8</option>
                                            </Form.Select>
                                        </Col>
                                        <Col>
                                            <Form.Select size="sm" value={forceUnit.pilotSkill}
                                                 onChange={ (e) => updateForceUnitPiloting(forceUnit.id, parseDropDownAsNumber(e))}>
                                                <option>0</option><option>1</option><option>2</option>
                                                <option>3</option><option>4</option><option>5</option>
                                                <option>6</option><option>7</option><option>8</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </td>
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