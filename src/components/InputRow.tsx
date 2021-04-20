import React, { useState, useEffect } from 'react'
import { DataListStateType, TableDataEntry, AllDataListsType } from '../interfaces/Interfaces'
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { IconButton, TableCell, TableRow, TextField, InputAdornment } from '@material-ui/core'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.background.default,
            },
            '&:nth-of-type(even)': {
                backgroundColor: blueGrey[800],
            },
            '& input': {
                backgroundColor: 'inherit',
                paddingLeft: 0,
            }
        },
    }),
)(TableRow);

export default function InputRow(props:
    {
        entry: TableDataEntry,
        i: number,
        fields: { name: string }[],
        dataLists?: AllDataListsType
        handleChange: Function,
        handleUpdate: Function,
        deleteEntry: Function,
        classes: string
    }) {

    // State controls
    const [state, setState] = useState<TableDataEntry>({ amount: "" })

    function handleInputRowChange(event: React.ChangeEvent<HTMLInputElement>): void {
        let { name, value } = event.target;
        setState({ ...state, [name]: value })
    }

    // Helper function to create datalists for category and person fields
    // This helps the user make a valid entry
    function makeDataList(propsState: DataListStateType[], id: string) {
        return (
            <datalist id={id}>
                {propsState.map((entry: DataListStateType) => {
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

    // Set props to state on render
    useEffect(() => {
        setState(props.entry)
    }, [props.entry])

    return (
        <StyledTableRow>
            {props.fields
                .filter(column => !column.name.includes("id"))
                .map(column => {
                    return (
                        <TableCell className={props.classes}>
                            <TextField
                                name={column.name}
                                // On blur, update state of entire table via handleChange dispatch in props
                                onBlur={(e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                                    props.handleChange(e, props.i)
                                }}
                                onChange={handleInputRowChange}
                                className="tableInput"
                                value={state[column.name as keyof TableDataEntry] || ""}
                                inputProps={{
                                    list: column.name
                                }}
                                InputProps={
                                     {
                                    startAdornment: <InputAdornment position="start">{column.name === 'amount' ? "$" : null}</InputAdornment>,
                                    disableUnderline: true
                                }
                            }
                                style={{ width: '80%' }}
                            />
                            {column.name === 'person' && props.dataLists?.persons ? (
                                makeDataList(props.dataLists?.persons, column.name)
                            ) : null}
                            {column.name === 'narrow_category' && props.dataLists?.narrow_categories ? (
                                makeDataList(props.dataLists?.narrow_categories, column.name)
                            ) : null}
                            {column.name === 'broad_category' && props.dataLists?.broad_categories ? (
                                makeDataList(props.dataLists?.broad_categories, column.name)
                            ) : null}
                        </TableCell>
                    )
                })}
            <TableCell className={props.classes}>
                <IconButton
                    color="primary"
                    onClick={() => props.handleUpdate(props.i)}
                >
                    <SaveIcon />
                </IconButton>
            </TableCell>
            <TableCell className={props.classes}>
                <IconButton
                    aria-label="delete"
                    color="secondary"
                    onClick={() => props.deleteEntry(state.id)}
                >
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </StyledTableRow>
    )
}