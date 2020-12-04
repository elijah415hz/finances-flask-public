import React, {useState, useEffect} from 'react'

interface tableDataEntry {
    Amount: string,
    Date?: string,
    Source?: string,
    Person?: string,
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

export default function InputRow(props:
    {
        entry: tableDataEntry,
        i: number,
        fields: { name: string }[],

        sourcesState?: dataListStateType[],
        personsState?: dataListStateType[],
        broadState?: dataListStateType[],
        narrowState?: dataListStateType[],
        handleChange: Function,
        setSourcesState?: Function,
        setPersonsState?: Function,
        setBroadState?: Function,
        setNarrowState?: Function,
        deleteEntry: Function
    }) {

    const [state, setState] = useState<tableDataEntry>({Amount: ""})

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

    function handleInputRowChange(event: React.ChangeEvent<HTMLInputElement>): void {
        let {name, value} = event.target;
        setState({...state, [name]: value})
    }

    useEffect(() => {
        setState(props.entry)
    }, [props.entry])

    return (
        <tbody>
            <tr>
                {props.fields
                    .filter(column => !column.name.includes("id"))
                    .map(column => {
                        return (
                            <td>
                                {column.name === 'Amount' ? <span>$</span> : null}
                                <input
                                    name={column.name}
                                    onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        props.handleChange(e, props.i)
                                    }}
                                    onChange={handleInputRowChange}
                                    className="tableInput"
                                    value={state[column.name as keyof tableDataEntry] || ""}
                                    list={column.name}
                                />
                                {column.name === 'Source' && props.sourcesState ? (
                                    makeDataList(props.sourcesState, column.name)
                                ) : null}
                                {column.name === 'Person' && props.personsState ? (
                                    makeDataList(props.personsState, column.name)
                                ) : null}
                                {column.name === 'Narrow_category' && props.narrowState ? (
                                    makeDataList(props.narrowState, column.name)
                                ) : null}
                                {column.name === 'Broad_category' && props.broadState ? (
                                    makeDataList(props.broadState, column.name)
                                ) : null}
                            </td>
                        )
                    })}
                    <td>
                        <button onClick={()=> props.deleteEntry(state.entry_id || state.id)}>Delete</button>
                    </td>
            </tr>
        </tbody>
    )
}