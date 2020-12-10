import React, {useState, useEffect} from 'react'
import {dataListStateType, tableDataEntry, allDataListsType} from '../interfaces/Interfaces'

export default function InputRow(props:
    {
        entry: tableDataEntry,
        i: number,
        fields: { name: string }[],
        dataLists?: allDataListsType
        handleChange: Function,
        handleUpdate: Function,
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
                                {column.name === 'Source' && props.dataLists?.source ? (
                                    makeDataList(props.dataLists?.source, column.name)
                                ) : null}
                                {column.name === 'Person' && props.dataLists?.person_earner ? (
                                    makeDataList(props.dataLists?.person_earner, column.name)
                                ) : null}
                                {column.name === 'Narrow_category' && props.dataLists?.narrow_category ? (
                                    makeDataList(props.dataLists?.narrow_category, column.name)
                                ) : null}
                                {column.name === 'Broad_category' && props.dataLists?.broad_category ? (
                                    makeDataList(props.dataLists?.broad_category, column.name)
                                ) : null}
                                {column.name === 'Vendor' && props.dataLists?.vendor ? (
                                    makeDataList(props.dataLists?.vendor, column.name)
                                ) : null}
                            </td>
                        )
                    })}
                    <td>
                        <button onClick={()=> props.handleUpdate(props.i)}>Update</button>
                    </td>
                    <td>
                        <button onClick={()=> props.deleteEntry(state.entry_id || state.id)}>Delete</button>
                    </td>
            </tr>
        </tbody>
    )
}