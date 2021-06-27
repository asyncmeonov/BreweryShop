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
} from "@material-ui/core";
import React from "react";

const getLicenseTypes = async (): Promise<string[]> => {
  let response = get<License[]>("/admin/license");
  return (await response).map((license) => license.type);
};

const postBeer = async (beerRequest: AdminBeerRequest): Promise<string> => post<string>("/admin/beers", beerRequest);

const AdminBeerCreateView = () => {
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
  const onSubmit = handleSubmit((data) => {
        let response = postBeer(data);
        //TODO handle response 
      });

  //(Dynamic fields) License models for a beer
  const [modelCount, setModelCount] = useState(0);
  const { data } = useQuery<string[]>("License", getLicenseTypes);
  const [licenseMap, setLicenseMap] = useState(new Map());

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>, key: number) => {
    handleAdd(key, event.target.value as string)
      };

  const handleAdd = (key: number, value: string) => {
        licenseMap.set(key, value)
   setModelCount( modelCount + 1); //I have no clue why this works but if you don't update a variable with a state hook, the license map would not update in the UI
      }

  const handleDelete = (key: number) => {
        licenseMap.delete(key);
      setModelCount(modelCount - 1);
      };

  if (window.token === undefined || !window.isAdmin) {
    return (
      <div>
        You don't have a valid license. Go back to the <a href="/">homepage</a>
      </div>
    );
  }

  return (
    <Box>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Create Beer
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Beer</DialogTitle>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Name"
                fullWidth
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Description"
                fullWidth
                multiline
              />
            )}
          />
          <Controller
            name="label"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Label URL"
                fullWidth
                type="url"
              />
            )}
          />
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Size (ml)"
                fullWidth
                type="number"
              />
            )}
          />
          <Controller
            name="amountInStock"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Amount In Stock"
                fullWidth
                type="number"
              />
            )}
          />
          <Controller
            name="amountAvailable"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Amount Available for Purchase by clients"
                fullWidth
                type="number"
              />
            )}
          />
          <Controller
            name="isAvailableByDefault"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={<Checkbox name="checkedD" />}
                label="Is it available by default? (i.e. if a license model doesn't exist for it)"
              />
            )}
          />
          <Controller
            name="defaultPrice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Default Price (only usable if the beer is available by default)"
                fullWidth
                type="number"
              />
            )}
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
                  )} // as `priceModels.${number}.licenseType`
                    value={licenseMap.get(i)}
                    onChange={e => {handleChange(e, i)}}
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
                    label="Price (bgn)"
                    {...register(
                      `priceModels.${i}.price`
                    )} // as `priceModels.${number}.price`
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
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary">
            Create Beer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBeerCreateView;