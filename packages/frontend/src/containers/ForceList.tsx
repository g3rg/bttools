import {Col, Form, Offcanvas, Row, Table} from "react-bootstrap"
import {calculateBV, calculateForceBV} from "../lib/battletech.ts"
import Button from "react-bootstrap/Button"
import {FaMinus} from "react-icons/fa"
import {ForceType, ForceUnit} from "../types/force.ts"
import {BsClipboard2Plus, BsClipboardCheck, BsCopy, BsPrinter} from "react-icons/bs";

const Flechs_UnitDetail_URL = `https://sheets.flechs.net/?s=`

interface ForceListProps {
    showForce: boolean
    force: ForceType
    handleHideForce: ()=>void
    removeUnitFromForce: (fUnit: ForceUnit) => void
    updateForceUnitGunnery: (id: string, newSkill: number) => void
    updateForceUnitPiloting: (id: string, newSkill: number) => void
    addUnitsFromClipboard: () => void
    loadForceFromClipboard: () => void
    copyForceToClipboard: () => void
}

function parseDropDownAsNumber(e:  React.ChangeEvent<HTMLSelectElement>) {
    return parseInt(e.target.value || '0')
}

function buildFlechsURL(force: ForceType) {
    let mechNames = force?.units?.map( (fUnit: ForceUnit) => {
        return (fUnit.unit.mechName || '') + ','
    })

    return Flechs_UnitDetail_URL + mechNames
}

export default function ForceList( props : ForceListProps) {
    let { showForce, force, handleHideForce, removeUnitFromForce, copyForceToClipboard,
        updateForceUnitGunnery, updateForceUnitPiloting, addUnitsFromClipboard, loadForceFromClipboard } = props


    function renderAvailability() {
        let eras = force?.units?.[0]?.unit?.unitEras
        let factions = force?.units?.[0]?.unit?.unitFactions
        let factionEras = force?.units?.[0]?.unit?.unitFactionEras

        force?.units?.forEach ( (forceUnit) => {
            let loopEras: string[] = []
            let loopFactions: string[] = []
            let loopFactionEras: string[] = []

            forceUnit.unit.unitEras?.forEach( (unitEra) => {
                if (eras?.includes(unitEra)) {
                    loopEras.push(unitEra)
                }
            })
            forceUnit.unit.unitFactions?.forEach( (unitFaction) => {
                if (factions?.includes(unitFaction)) {
                    loopFactions.push(unitFaction)
                }
            })
            forceUnit.unit.unitFactionEras?.forEach( (unitFactionEra) => {
                if (factionEras?.includes(unitFactionEra)) {
                    loopFactionEras.push(unitFactionEra)
                }
            })

            eras = loopEras
            factions = loopFactions
            factionEras = loopFactionEras
        } )

        return (
            <>
                <b>Faction Availability:</b><br/>
                { factions?.map( (faction) => {
                    return (
                        <>{faction}, </>
                    )
                })}<br/>
                <b>Era Availability:</b><br/>
                { eras?.map( (era) => {
                    return (
                        <>{era}, </>
                    )
                })}<br/>
                <b>Faction Era Availability:</b><br/>
                {factionEras?.map( (factionEra) => {
                    return (
                        <>{factionEra}, </>
                    )
                })}<br/>
            </>
        )
    }

    function createForcePDFLink() {
        let summary = force.units?.map ( (forceUnit) => {
            return         {
                name: forceUnit.unit.mechName,
                type: 'BattleMech',
                BV: calculateBV(forceUnit.unit.bv || '', forceUnit.gunnerySkill, forceUnit.pilotSkill),
                skill: `${forceUnit.pilotSkill}/${forceUnit.gunnerySkill}`,
                tons: forceUnit.unit.tons
            }
        })

        return '/forcePdf?f=' + JSON.stringify((summary))
    }

    return (
        <Offcanvas show={showForce} onHide={handleHideForce} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Force Builder</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Button title="Copy Force to Clipboard" onClick={ () => {
                    copyForceToClipboard()
                }}><BsCopy/></Button>&nbsp;
                <Button title="Add Units from Clipboard" onClick={ () => {
                    addUnitsFromClipboard()
                }}><BsClipboard2Plus/></Button>&nbsp;
                <Button title="Import force from clipboard" onClick={ () => {
                    loadForceFromClipboard()
                }}><BsClipboardCheck/></Button>&nbsp;
                <a target='_blank' href={createForcePDFLink()}>
                <Button title="Create PDF" onClick={ () => {
                }}><BsPrinter/></Button></a>&nbsp;
                <br/>
                <a href={buildFlechsURL(force)} target="_">Open in Flechs</a>&nbsp;&nbsp;
                <br/>
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

                    { force?.units?.map( (forceUnit) => {
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
                        <td>{calculateForceBV(force)}</td>
                    </tr>
                    </tbody>
                </Table>
                { renderAvailability() }
            </Offcanvas.Body>
        </Offcanvas>
    )
}