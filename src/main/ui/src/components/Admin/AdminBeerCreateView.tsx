import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
//Components
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
//styles
import {
  AdminBeerRequest,
  License,
} from "../interfaces";
import { get, post } from "../Http";
import { useQuery } from "react-query";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  FormControlLabel,
  InputLabel,
  NativeSelect,
  IconButton,
  Snackbar
} from "@material-ui/core";
import React from "react";
import { getGlobalIsAdmin, getGlobalToken } from "../../window";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function formatPrice(val: string) {
  return parseInt(val) < 0
    ? "0"
    : val
}

const getLicenseTypes = async (): Promise<string[]> => {
  let response = get<License[]>("/admin/license");
  return (await response).map((license) => license.type);
};

const postBeer = async (beerRequest: AdminBeerRequest) => await post("/admin/beers", beerRequest);


const AdminBeerCreateView = (props: { refetch: () => {} }) => {
  let { refetch } = props
  //Dialog form hooks
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {
    register,
    control,
    handleSubmit,
    unregister,
    formState: { errors },
  } = useForm<AdminBeerRequest>();

  //popup related hooks
  const [popupOpen, setPopuptOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | undefined>();
  const [isError, setIsError] = useState(false);

  const handlePopupClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setPopuptOpen(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    let response = await postBeer(data);
    if (response.ok) {
      setPopupMessage(`Created ${data.name} ${data.size}ml`);
      setIsError(false);
      setPopuptOpen(true);
      setOpen(false);
      refetch();
    } else {
      let errorMessage = await response.text()
      setPopupMessage(errorMessage);
      setIsError(true);
      setPopuptOpen(true);
      refetch();
    }
  });

  //(Dynamic fields) License models for a beer
  const [modelCount, setModelCount] = useState(0);
  const { data } = useQuery<string[]>("License", getLicenseTypes);
  const [licenseMap] = useState(new Map());

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>, key: number) => {
    handleAdd(key, event.target.value as string)
  };

  const handleAdd = (key: number, value: string) => {
    licenseMap.set(key, value)
    setModelCount(modelCount + 1); //I have no clue why this works but if you don't update a variable with a state hook, the license map would not update in the UI
  }

  const handleDelete = (key: number) => {
    licenseMap.delete(key);
    setModelCount(modelCount - 1);
  };

  if (getGlobalToken() === undefined || !getGlobalIsAdmin()) {
    return (
      <div>
        You don't have a valid license. Go back to the <a href="/">homepage</a>
      </div>
    );
  }

  return (
    <Box>
      <Button variant="outlined" color="primary" onClick={() => { handleClickOpen() }}>
        Create Beer
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Beer</DialogTitle>
        <DialogContent>
          <TextField
            {...register("name")}
            name="name"
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
          />
          <TextField
            {...register("description")}
            name="description"
            margin="dense"
            label="Description"
            fullWidth
            multiline
          />
          <TextField
            {...register("label")}
            name="label"
            margin="dense"
            label="Label URL"
            fullWidth
            type="url"
          />

          <TextField
            {...register("size")}
            name="size"
            margin="dense"
            label="Size (ml)"
            fullWidth
            type="number"
            onChange={(event) => event.target.value = formatPrice(event.target.value)}
          />
          <TextField
            {...register("amountInStock")}
            name="amountInStock"
            margin="dense"
            label="Amount In Stock"
            fullWidth
            type="number"
            onChange={(event) => event.target.value = formatPrice(event.target.value)}
          />

          <TextField
            {...register("amountAvailable")}
            name="amountAvailable"
            margin="dense"
            label="Amount Available for Purchase by clients"
            fullWidth
            type="number"
            onChange={(event) => event.target.value = formatPrice(event.target.value)}
          />
          <Controller
            name="availableByDefault"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={<Checkbox name="checkedD" />}
                label="Is it available by default? (i.e. if a license model doesn't exist for it)"
              />
            )}
            />
          <TextField
            {...register(
              "defaultPrice"
            )}
            margin="dense"
            label="Default Price in stotinki (if available by default)"
            fullWidth
            type="number"
            onChange={(event) => event.target.value = formatPrice(event.target.value)}
          />
          <IconButton
            aria-label="add-price-model"
            color="primary"
            onClick={() => {
              handleAdd(licenseMap.size, "");
            }}
          >
            <AddIcon />
          </IconButton>
          {Array.from(licenseMap.keys()).map((i) => {
            return (
              <div key={i}>
                <InputLabel>License Type</InputLabel>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <NativeSelect
                    {...register(
                      `priceModels.${i}.licenseType`
                    )}
                    value={licenseMap.get(i)}
                    onChange={e => { handleChange(e, i) }}
                  >
                    <option
                      key="none" value=""></option>
                    {data?.map((licenseType) => (
                      <option
                        key={`${i}-${licenseType}`} value={licenseType}>
                        {licenseType}
                      </option>
                    ))}
                  </NativeSelect>
                  <TextField
                    type="number"
                    key={`${i}-price`}
                    label="Price (stotinki)"
                    {...register(
                      `priceModels.${i}.price`
                    )}
                    onChange={(event) => event.target.value = formatPrice(event.target.value)}
                  />
                  <IconButton
                    key={`${i}-delete`}
                    aria-label="delete"
                    color="primary"
                    onClick={() => {
                      unregister((`priceModels.${i}.licenseType`) as `priceModels.${number}.licenseType`);
                      unregister((`priceModels.${i}.price`) as `priceModels.${number}.price`);
                      handleDelete(i);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { handleClose() }} color="primary">
            Cancel
          </Button>
          <Button onClick={(e) => { onSubmit(e) }} color="primary">
            Create Beer
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={popupOpen} autoHideDuration={6000} onClose={handlePopupClose}>
        <Alert
          onClose={handlePopupClose} severity={isError ? "error" : "success"}>
          {popupMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminBeerCreateView;