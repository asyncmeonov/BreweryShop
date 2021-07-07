import { Button, Dialog, DialogActions, DialogContentText, DialogTitle, Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { AlertPromptProps, SnackbarPopupProps } from "./components/types";

export function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function CustomSnackbarAlert(props: SnackbarPopupProps) {
    const { open, onClose, contentText, severity, timeout } = props;
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={open} autoHideDuration={timeout ? timeout : 6000} onClose={onClose}>
            <Alert
                onClose={onClose} severity={severity}>
                {contentText}
            </Alert>
        </Snackbar>)
}

export function CustomPopup(props: AlertPromptProps) {
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