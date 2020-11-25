import React, { useEffect } from 'react'
import API from "../utils/API"

interface tableDataEntry {
    Amount: string,
    Date: string,
    Source: string,
    Person: string,
    id?: number,
    source_id?: number,
    earner_id?: number,
    Vendor?: string,
    Broad_category?: string,
    Narrow_category?: string,
    Notes?: string,
    entry_id?: number
}

interface dataListStateType {
    id: number,
    name: string
}

export default function Table(props:
    {
        state:
        {
            schema:
            {
                fields: { name: string }[]
            },
            data: tableDataEntry[]

        },
        sourcesState: dataListStateType[],
        personsState: dataListStateType[]
        handleChange: Function,
        setSourcesState: Function,
        setPersonsState: Function
    }) {

    function makeDataList(propsState: dataListStateType[], id: string) {
        return (
            <datalist id={id}>
                {propsState.map((entry: dataListStateType) => {
                    return (
                        <option
                            value={entry.name}
                            key={entry.id}
                        />
                    )
                })}
            </datalist>
        )
    }

    useEffect(() => {
        async function getDataLists(): Promise<void> {
            if (props.sourcesState.length === 0) {
                let { data } = await API.sources()
                props.setSourcesState(data)
            }
            if (props.personsState.length === 0) {
                let res = await API.persons()
                props.setPersonsState(res.data)
            }
        }
        getDataLists()
    }, [])

    return (
        <table>
            <thead>
                <tr>
                    {props.state.schema.fields
                        .filter(column => !column.name.includes("id"))
                        .map(column => {
                            return (
                                <th key={column.name}>
                                    {column.name.replace("_", " ")}
                                </th>
                            )
                        })}
                </tr>
            </thead>
            {(props.state.data).map((entry: tableDataEntry, i: number) => {
                return (
                    <tbody key={i}>
                        <tr>
                            {props.state.schema.fields
                                .filter(column => !column.name.includes("id"))
                                .map(column => {
                                    return (
                                        <td key={i + column.name}>
                                            {column.name === 'Amount' ? <span>$</span> : null}
                                            <input
                                                name={column.name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.handleChange(e, (entry.id ? entry.id : entry.entry_id))}
                                                className="tableInput"
                                                value={entry[column.name as keyof tableDataEntry] || ""}
                                                list={column.name}
                                            />
                                            {column.name === 'Source' ? (
                                                makeDataList(props.sourcesState, column.name)
                                                ) : null}
                                            {column.name === 'Person' ? (
                                                makeDataList(props.personsState, column.name)
                                            ) : null}
                                        </td>
                                    )
                                })}
                        </tr>
                    </tbody>
                )
            })}
        </table>
    )
}