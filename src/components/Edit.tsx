import React, { useState } from "react";
import {
  DialogContent,
  Typography,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Card,
  CardContent,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { AllDataListsType, EditFormType } from "../interfaces/Interfaces";
import API from "../utils/API";
import { useAuth } from "../Context/Auth";
import { useStateContext } from "../Context/State";

export default function Edit(props: {
  handleClose: Function;
  classes: { root: string; formControl: string; card: string; close: string };
  categories: AllDataListsType;
  setCategories: Function;
  setLoading: Function;
}) {
  const { Auth, setAuth } = useAuth();
  const { setAlertState } = useStateContext();

  const initialFormState = {
    person: "",
    broad_category: "",
    broad_category_id: NaN,
    narrow_category: "",
    has_person: false,
  };

  // Form control state
  const [formState, setFormState] = useState<EditFormType>(initialFormState);

  function handleFormChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ): void {
    let name = event.target.name as keyof EditFormType;
    let value = event.target.value;
    if (name === "has_person") {
      // Casting event.target so that ts knows check property will be there
      value = (event.target as HTMLInputElement).checked;
    }
    setFormState({ ...formState, [name]: value });
  }

  async function handleFormSubmit(
    event: React.SyntheticEvent,
    form: "person" | "narrow_category" | "broad_category"
  ): Promise<any> {
    event.preventDefault();
    props.setLoading(true);
    let data;
    try {
      switch (form) {
        case "person":
          data = { person: formState.person };
          if (!data.person) {
            throw new Error("Empty Input");
          }
          break;
        case "broad_category":
          data = {
            broad_category: formState.broad_category,
            has_person: formState.has_person,
          };
          if (!data.broad_category) {
            throw new Error("Empty Input");
          }
          break;
        case "narrow_category":
          data = {
            narrow_category: formState.narrow_category,
            broad_category_id: formState.broad_category_id,
            has_person: formState.has_person,
          };
          if (!data.narrow_category || !data.broad_category_id) {
            throw new Error("Empty Input");
          }
          break;
      }
      await API.addCategories(Auth.token, data);
      setAlertState({
        severity: "success",
        message: "Category Added!",
        open: true,
      });
      let updatedCategories = await API.getCategories(Auth.token);
      props.setCategories(updatedCategories);
    } catch (err) {
      switch (err.message) {
        case "Error! 500":
          setAlertState({
            severity: "error",
            message: "Server Error!",
            open: true,
          });
          break;
        case "Unauthorized":
          setAuth({ type: "LOGOUT" });
          break;
        case "Empty Input":
          setAlertState({
            severity: "error",
            message: "Please fill out all fields",
            open: true,
          });
          break;
        default:
          setAlertState({
            severity: "error",
            message: "You must be connected to the internet to add categories",
            open: true,
          });
      }
    } finally {
      props.setLoading(false);
      setFormState(initialFormState);
    }
  }

  return (
    <DialogContent>
      <IconButton
        onClick={() => props.handleClose()}
        className={props.classes.close}
      >
        <CloseIcon />
      </IconButton>
      <Card className={props.classes.card}>
        <CardContent>
          <Typography
            variant="h5"
            component="h5"
            className={props.classes.root}
          >
            Add a Person
          </Typography>
          <form
            className={props.classes.root}
            onSubmit={(e: React.SyntheticEvent) =>
              handleFormSubmit(e, "person")
            }
          >
            <TextField
              onChange={handleFormChange}
              value={formState.person}
              label="Person"
              name="person"
              type="string"
            />
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className={props.classes.card}>
        <CardContent>
          <Typography
            variant="h5"
            component="h5"
            className={props.classes.root}
          >
            Add a Broad Category
          </Typography>
          <form
            className={props.classes.root}
            onSubmit={(e: React.SyntheticEvent) =>
              handleFormSubmit(e, "broad_category")
            }
          >
            <TextField
              onChange={handleFormChange}
              value={formState.broad_category}
              label="Broad Category"
              name="broad_category"
              type="string"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formState.has_person}
                  onChange={handleFormChange}
                  name="has_person"
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label="Person"
            />
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className={props.classes.card}>
        <CardContent>
          <Typography
            variant="h5"
            component="h5"
            className={props.classes.root}
          >
            Add a Narrow Category
          </Typography>
          <form
            className={props.classes.root}
            onSubmit={(e: React.SyntheticEvent) =>
              handleFormSubmit(e, "narrow_category")
            }
          >
            <FormControl className={props.classes.formControl}>
              <InputLabel htmlFor="broad_category">Broad Category</InputLabel>
              <Select
                onChange={handleFormChange}
                name="broad_category_id"
                labelId="broad_category_id"
                label="Broad Category"
              >
                {props.categories.broad_categories.map((i) => (
                  <MenuItem value={i.id}>{i.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              onChange={handleFormChange}
              value={formState.narrow_category}
              label="Narrow Category"
              name="narrow_category"
              type="string"
            />
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </DialogContent>
  );
}
