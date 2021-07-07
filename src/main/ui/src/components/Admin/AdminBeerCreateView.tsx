import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
//Components
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
//styles
import {
  AdminBeerRequest,
} from "../interfaces";
import { post } from "../Http";
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
  IconButton
} from "@material-ui/core";
import React from "react";
import { BeerFormProps } from "../types";
import { CustomSnackbarAlert } from "../../Alert";

const postBeer = async (beerRequest: AdminBeerRequest) => await post("/admin/beers", beerRequest);

const AdminBeerCreateView = (props: BeerFormProps) => {
  let { getLicenseTypes, refetch } = props;
  //Dialog form hooks
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {
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
    data.priceModels = (data.priceModels !== undefined) ? data.priceModels.filter(model => model !== null) : [];

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
  const { data } = useQuery<string[]>("License", getLicenseTypes);
  const [licenseList, setLicenseList] = useState<(string | null)[]>([]);

  const handleAdd = (value: string) => {
    setLicenseList([...licenseList, value]);
  }

  const handleDelete = (key: number) => {
    const newList = licenseList.map((old, index) => index === key ? null : old);
    setLicenseList(newList);
  };

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
            name="availableByDefault"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={<Checkbox checked={field.value} name="checkedD" />} //The checked field is there to persists last value b/w creations
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
                label="Default Price in stotinki (if available by default)"
                fullWidth
                type="number"
              />
            )}
          />
          <IconButton
            aria-label="add-price-model"
            color="primary"
            onClick={() => {
              handleAdd("");
            }}
          >
            <AddIcon />
          </IconButton>
          {licenseList.map((lic, i) => {
            if (lic !== null) {
              return (
                <div key={i}>
                  <InputLabel>License Type</InputLabel>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Controller
                      name={`priceModels.${i}.licenseType`}
                      control={control}
                      render={({ field }) => (
                        <NativeSelect
                          {...field}
                          value={field.value}
                        >
                          <option
                            key="none" value=""></option>
                          {data?.map((licenseType) => (
                            <option
                              key={`${i}-${licenseType}`} value={licenseType}>
                              {licenseType}
                            </option>
                          ))}
                        </NativeSelect>)}
                    />
                    <Controller
                      name={`priceModels.${i}.price`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          key={`${i}-price`}
                          label="Price (stotinki)"
                          value={field.value}
                        />)}
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
            }
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
      <CustomSnackbarAlert {...{
        open: popupOpen,
        onClose: handlePopupClose,
        severity: (isError ? "error" : "success"),
        contentText: popupMessage
      }} />
    </Box>
  );
};

export default AdminBeerCreateView;