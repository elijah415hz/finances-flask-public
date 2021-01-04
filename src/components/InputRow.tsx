import React, { useState, useEffect } from 'react'
import { DataListStateType, TableDataEntry, AllDataListsType } from '../interfaces/Interfaces'
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { IconButton, TableCell, TableRow, TextField, InputAdornment } from '@material-ui/core'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';


const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        body: {
            fontSize: 14,
            padding: 0,
            maxWidth: '10ch',
        },
    }),
)(TableCell);

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
        deleteEntry: Function
    }) {

    const [state, setState] = useState<TableDataEntry>({ amount: "" })

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

    function handleInputRowChange(event: React.ChangeEvent<HTMLInputElement>): void {
        let { name, value } = event.target;
        setState({ ...state, [name]: value })
    }

    useEffect(() => {
        setState(props.entry)
    }, [props.entry])

    return (
        <StyledTableRow>
            {props.fields
                .filter(column => !column.name.includes("id"))
                .map(column => {
                    return (
                        <StyledTableCell

                        >
                            <TextField
                                name={column.name}
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
                                    startAdornment: <InputAdornment position="start">{column.name === 'Amount' ? "$" : null}</InputAdornment>,
                                    disableUnderline: true
                                }
                            }
                                style={{ width: '80%' }}
                            // style={{width: `${(state[column.name as keyof TableDataEntry]?.toString().length || 12) + 3.5}ch`}}
                            />
                            {/* {column.name === 'Source' && props.dataLists?.source ? (
                                makeDataList(props.dataLists?.source, column.name)
                            ) : null} */}
                            {column.name === 'Person' && props.dataLists?.persons ? (
                                makeDataList(props.dataLists?.persons, column.name)
                            ) : null}
                            {column.name === 'Narrow_category' && props.dataLists?.narrow_categories ? (
                                makeDataList(props.dataLists?.narrow_categories, column.name)
                            ) : null}
                            {column.name === 'Broad_category' && props.dataLists?.broad_categories ? (
                                makeDataList(props.dataLists?.broad_categories, column.name)
                            ) : null}
                            {/* {column.name === 'Vendor' && props.dataLists?.vendors ? (
                                makeDataList(props.dataLists?.vendors, column.name)
                            ) : null} */}
                        </StyledTableCell>
                    )
                })}
            <StyledTableCell>
                <IconButton
                    color="primary"
                    onClick={() => props.handleUpdate(props.i)}
                >
                    <SaveIcon />
                </IconButton>
            </StyledTableCell>
            <StyledTableCell>
                <IconButton
                    aria-label="delete"
                    color="secondary"
                    onClick={() => props.deleteEntry(state.entry_id || state.id)}
                >
                    <DeleteIcon />
                </IconButton>
            </StyledTableCell>
        </StyledTableRow>
    )
}