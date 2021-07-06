import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { PopupProps } from "./components/types";

export function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export function CustomPopup(props: PopupProps) {
    const { title, contentText, open, submitButtonText, asyncRequest, onClose } = props

    const onSubmit = async () => {
        if (asyncRequest) {
            let response = asyncRequest();
            if (await response) {
                onClose();
            }
        } else onClose();
    }


    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContentText>
                {contentText}
            </DialogContentText>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onSubmit} color="secondary">
                    {submitButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}