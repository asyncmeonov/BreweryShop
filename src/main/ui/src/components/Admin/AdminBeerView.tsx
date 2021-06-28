import { useState } from "react";
//Components
import LinearProgress from "@material-ui/core/LinearProgress";
//styles
import { Wrapper } from "./AdminOrderView.style";
import { AdminBeer } from "../interfaces";
import { get, remove } from "../Http";
import CustomAppBar from "../CustomAppBar";
import { useQuery } from "react-query";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  TableRow,
  TableCell,
  IconButton,
  makeStyles,
  Collapse,
  Box,
  TableHead,
  Table,
  TableBody,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText
} from "@material-ui/core";
import React from "react";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import AdminBeerCreateView from "./AdminBeerCreateView";
import { formatPrice } from "../../window";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

type DeletePopupProps = {
  open: boolean,
  row: AdminBeer,
  onClose: () => void
}

const DeletePopup = (props: DeletePopupProps) =>{
  const {row, open, onClose} = props
  const onSubmit = () => {
    remove("/admin/beers/"+row.id, null);
    onClose();
  };
  
  return(
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="form-dialog-title"
    >
    <DialogTitle id="form-dialog-title">Are you sure?</DialogTitle>
           <DialogContentText>
            You are trying to delete <b>{row.name} {row.size}ml</b>. This cannot be undone.
          </DialogContentText>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onSubmit} color="secondary">
        Delete Beer
      </Button>
    </DialogActions>
    </Dialog>
    )
}

function Row(props: { row: AdminBeer }) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>{row.size}</TableCell>
        <TableCell>{row.amountInStock}</TableCell>
        <TableCell>{row.amountAvailable}</TableCell>
        <TableCell>{row.isAvailableByDefault ? "Yes" : "No"}</TableCell>
        <TableCell>{row.defaultPrice}</TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell> 
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => setDeletePopup(true)}
            > <DeleteIcon />
            </IconButton>
            <DeletePopup row={row} open={deletePopup} onClose={() => {setDeletePopup(false)}}/>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {/* <Typography variant="h6" gutterBottom component="div">
                Price Per License
              </Typography> */}
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>License Type</TableCell>
                    <TableCell>Price (BGN)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.priceModels.map((priceModelRow) => (
                    <TableRow key={priceModelRow.licenseType}>
                      <TableCell component="th" scope="row">
                        {priceModelRow.licenseType}
                      </TableCell>
                      <TableCell>
                        {formatPrice(priceModelRow.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const getBeers = async (): Promise<AdminBeer[]> =>
  get<AdminBeer[]>("/admin/beers");

const AdminBeerView = () => {
  if (window.token === undefined || !window.isAdmin) {
    return (
      <Wrapper>
        <div>
          You don't have a valid license. Go back to the{" "}
          <a href="/">homepage</a>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <CustomAppBar />
      <Box display="flex">
        <AdminBeerCreateView />
      </Box>

      <AdminTableView />
    </Wrapper>
  );
};

const AdminTableView = () => {
  const { data, isLoading, error } = useQuery<AdminBeer[]>(
    "AdminBeer",
    getBeers
  );

  if (isLoading) return <LinearProgress />;
  if (error) return <div> Something went wrong... {error} </div>;

      return (
    <TableContainer component={Paper}>
      <Table aria-label="beer table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Size (ml)</TableCell>
            <TableCell>Amount in stock</TableCell>
            <TableCell>Amount available for customers</TableCell>
            <TableCell>Is it available for non-listed licenses?</TableCell>
            <TableCell>Default price for non-listed licenses</TableCell>
            <TableCell>Description</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map(row => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminBeerView;
