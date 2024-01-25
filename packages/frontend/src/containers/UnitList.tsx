import { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { useAppContext } from '../lib/contextLib'
import './UnitList.css'

export default function UnitList() {
    const { isAuthenticated } = useAppContext()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return
            }
            setIsLoading(false)
        }

        onLoad()
    }, [isAuthenticated])

    function formatDate(str: undefined | string) {
        return !str ? "" : new Date(str).toLocaleString()
    }

    function renderMechList() {
        return (
            <>Mechs go here</>
        )
    }

    function renderMechs() {
        return (
            <div className="notes">
                <ListGroup>{!isLoading && renderMechList()}</ListGroup>
            </div>
        )
    }

    return (
        <div className="Home">
            { renderMechs() }
        </div>
    )
}