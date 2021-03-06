import React, { useState } from "react";
import API from "../utils/API";
import { useAuth } from "../Context/Auth";
import type {
  IncomeFormType,
  AllDataListsType,
} from "../interfaces/Interfaces";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  InputAdornment,
  Typography,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { saveRecord } from "../utils/db";
import { useStateContext } from "../Context/State";

export default function AddRecordsForm(props: {
  classes: { root: string; formControl: string; close: string };
  handleClose: Function;
  categories: AllDataListsType;
  setLoading: Function;
  reloadWallChart: Function;
}) {
  const { Auth, setAuth } = useAuth();
  const { setAlertState } = useStateContext();

  const initialFormState = {
    date: new Date(Date.now()),
    amount: NaN,
    person_id: NaN,
    source: "",
  };

  // Form control state
  const [formState, setFormState] = useState<IncomeFormType>(initialFormState);

  function handleFormChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ): void {
    let name = event.target.name as keyof typeof formState;
    setFormState({ ...formState, [name]: event.target.value });
  }

  function handleDateChange(date: Date | null) {
    setFormState({ ...formState, date: date });
  }

  async function handleFormSubmit(event: React.SyntheticEvent): Promise<any> {
    event.preventDefault();
    if (
      !formState.date ||
      !formState.amount ||
      !formState.person_id ||
      !formState.source
    ) {
      setAlertState({
        severity: "error",
        message: "Please fill out all fields",
        open: true,
      });
      return;
    }
    let formStateConvertedDate: any = { ...formState };
    try {
      formStateConvertedDate.date = formStateConvertedDate.date?.toLocaleDateString(
        "en-US"
      );
      props.setLoading(true);
      await API.postIncome(Auth.token, formStateConvertedDate);
      props.setLoading(false);
      setAlertState({
        severity: "success",
        message: "Record Saved!",
        open: true,
      });
      props.reloadWallChart();
    } catch (err) {
      props.setLoading(false);
      if (err.message === "Error! 500") {
        setAlertState({
          severity: "error",
          message: "Server Error!",
          open: true,
        });
        return;
      } else {
        saveRecord("income", formStateConvertedDate);
        setAlertState({
          severity: "warning",
          message: "Record Saved Locally",
          open: true,
        });
        if (err.message === "Unauthorized") {
          setAuth({ type: "LOGOUT" });
        }
      }
    } finally {
      setFormState(initialFormState);
    }
  }

  return (
    <DialogContent>
      <IconButton
        className={props.classes.close}
        onClick={() => {
          setFormState(initialFormState);
          props.handleClose();
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h5" component="h5" className={props.classes.root}>
        Log Income
      </Typography>
      <form className={props.classes.root} onSubmit={handleFormSubmit}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            name="Date"
            label="Date"
            value={formState.date}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <TextField
          onChange={handleFormChange}
          value={formState.source}
          label="Source"
          name="source"
          type="string"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          onChange={handleFormChange}
          value={formState.amount}
          label="Amount"
          name="amount"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          inputProps={{ step: "0.01" }}
        />
        <FormControl className={props.classes.formControl}>
          <InputLabel htmlFor="person_id">Person</InputLabel>
          <Select
            onChange={handleFormChange}
            value={formState.person_id}
            name="person_id"
            labelId="person_id"
            label="Person"
          >
            {props.categories.persons.map((i) => (
              <MenuItem value={i.id}>{i.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </DialogContent>
  );
}
