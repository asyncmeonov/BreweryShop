import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
//styles
import {
    AdminOrder
} from "../interfaces";
import { put } from "../Http";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    TextField,
    DialogContent,
    DialogActions,
    Snackbar,
    IconButton
} from "@material-ui/core";
import React from "react";
import { Alert } from "../../Alert";
import CreateIcon from '@material-ui/icons/Create';

type EditOrderFormProps = {
    selected: AdminOrder | undefined,
    refetch: () => {}
}

const putOrder = async (order: AdminOrder) => await put("/admin/order", order);

const AdminOrderEditView = (props: EditOrderFormProps) => {
    let { refetch, selected } = props

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        reset();
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const {
        control,
        reset,
        handleSubmit
    } = useForm<AdminOrder>();

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
        let order = selected as AdminOrder;
        order.notes = data.notes;
        console.log("data " + JSON.stringify(data));
        console.log("order " + JSON.stringify(order));
        let response = await putOrder(order);
        if (response.ok) {
            setPopupMessage(`Added notes.`);
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

    return (
        <Box>
            <IconButton
                onClick={() => handleClickOpen()}
                size="small"
            >
                <CreateIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Add Notes</DialogTitle>
                <DialogContent>
                    <Controller
                        name="notes"
                        control={control}
                        // eslint-disable-next-line eqeqeq
                        defaultValue={selected?.notes == undefined ? "" : selected.notes}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="dense"
                                label="Notes"
                                fullWidth
                                multiline
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { handleClose() }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={(e) => { onSubmit(e) }} color="primary">
                        Edit Order
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

export default AdminOrderEditView;