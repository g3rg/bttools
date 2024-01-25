import { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import {Accordion, Table} from 'react-bootstrap'
import { useAppContext } from '../lib/contextLib'
import { UnitType } from '../types/unit.ts'
import { mechdata } from '../mechdata.ts'
import './UnitList.css'

const dummyData = mechdata;

export default function UnitList() {
    const { isAuthenticated } = useAppContext()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                setIsLoading(false)
                return
            }
            setIsLoading(false)
        }

        onLoad()
    }, [isAuthenticated])

    function renderUnitList(units: UnitType[]) {
        return (
            <Table striped bordered hover size="sm" responsive="sm">
                <thead>
                <tr>
                    <th>Unit</th>
                    <th>Tons</th>
                    <th>BV</th>
                    <th>PV</th>
                    <th>Role</th>
                    <th>Rules</th>
                    <th>Intro</th>
                    <th>Links</th>
                </tr>
                </thead>
                <tbody>
                { units.map( (unit) => (
                    <tr>
                        <td>{unit.name}</td>
                        <td>{unit.tons}</td>
                        <td>{unit.bv}</td>
                        <td>{unit.pv}</td>
                        <td>{unit.role}</td>
                        <td>{unit.rules}</td>
                        <td>{unit.intro}</td>
                        <td>...</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        )
    }

    function renderUnits() {
        return (
            <div className="units">
                <ListGroup>{!isLoading && renderUnitList(dummyData)}</ListGroup>
            </div>
        )
    }

    function renderFilters() {
        return (
            <Accordion flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Filters</Accordion.Header>
                    <Accordion.Body>
                        Faction
                        Era
                        My Units
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )
    }

    return (
        <div className="Home">
            { renderFilters() }
            {renderUnits() }
        </div>
    )
}