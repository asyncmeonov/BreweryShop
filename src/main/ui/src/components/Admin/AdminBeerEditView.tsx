import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
//Components
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
//styles
import {
  AdminBeer,
  PriceModel
} from "../interfaces";
import {  put } from "../Http";
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

type EditBeerFormProps = BeerFormProps & {
  selected: AdminBeer | undefined
}

const putBeer = async (beer: AdminBeer) => await put("/admin/beers", beer);

const AdminBeerEditView = (props: EditBeerFormProps) => {
  let { getLicenseTypes, refetch, selected } = props
    //(Dynamic fields) License models for a beer
    const { data } = useQuery<string[]>("License", getLicenseTypes);
    const [licenseList, setLicenseList] = useState<(string | null)[]>([]);
  //Dialog form hooks
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    reset();
    if(selected !== undefined) setLicenseList(new Array(selected.priceModels.length).fill(""));
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }
  const {
    control,
    reset,
    handleSubmit,
    unregister,
    formState: { errors },
  } = useForm<AdminBeer>();

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
    let response = await putBeer(data);
    if (response.ok) {
      setPopupMessage(`Edited ${selected?.id} ${data.name} ${data.size}ml`);
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

  const handleAdd = (value: string) => {
    setLicenseList([...licenseList, value]);
  }

  const handleLicenseValue = (value: PriceModel | undefined) =>  (value !== undefined)? value.licenseType : "";
  const handlePriceValue = (value: PriceModel | undefined) =>  (value !== undefined)? value.price : 0;

  const handleDelete = (key: number) => {
    const newList = licenseList.map((old, index) => index === key ? null : old);
    setLicenseList(newList);
  };

  return (
    <Box>
      <Button variant="outlined" color="primary" disabled={(selected === undefined)} onClick={() => { handleClickOpen() }}>
        Edit Beer
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Beer</DialogTitle>
        <DialogContent>
        <Controller
            name="id"
            control={control}
            defaultValue={selected?.id}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                disabled={true}
                label="Unique ID in database (this cannot change)"
                fullWidth
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            defaultValue={selected?.name}
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
            defaultValue={selected?.description}
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
            defaultValue={selected?.label}
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
            defaultValue={selected?.size}
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
            defaultValue={selected?.amountInStock}
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
            defaultValue={selected?.amountAvailable}
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
            defaultValue={selected?.availableByDefault}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={<Checkbox defaultChecked={selected?.availableByDefault} name="checkedD" />} //The checked field is there to persists last value b/w creations
                label="Is it available by default? (i.e. if a license model doesn't exist for it)"
              />
            )}
          />
          <Controller
            name="defaultPrice"
            control={control}
            defaultValue={selected?.defaultPrice}
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
                      defaultValue={handleLicenseValue(selected?.priceModels[i])}
                      render={({ field }) => (
                        <NativeSelect
                          {...field}
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
                      defaultValue={handlePriceValue(selected?.priceModels[i])}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          key={`${i}-price`}
                          label="Price (stotinki)"
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
            Edit Beer
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

export default AdminBeerEditView;