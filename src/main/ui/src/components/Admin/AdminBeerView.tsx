import { useState } from "react";
//Components
import LinearProgress from "@material-ui/core/LinearProgress";
//styles
import { Wrapper } from "./AdminOrderView.style";
import { AdminBeer, License } from "../interfaces";
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
  Paper
} from "@material-ui/core";
import React from "react";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import AdminBeerCreateView from "./AdminBeerCreateView";
import { formatPrice, getGlobalIsAdmin, getGlobalToken } from "../../window";
import AdminBeerEditView from "./AdminBeerEditView";
import { CustomPopup } from "../../Alert";
import { AlertPromptProps } from "../types";
import { useHistory } from "react-router-dom";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

type SelectProps = {
  handleSelect: (beer: AdminBeer) => void,
  isSelected: (beer: AdminBeer) => boolean,
  refetch: () => {}
}

type RowProps = SelectProps & {
  row: AdminBeer
}

type TableProps = SelectProps & {
  data: AdminBeer[] | undefined
}

const getLicenseTypes = async (): Promise<string[]> => {
  let response = get<License[]>("/admin/license");
  return (await response).map((license) => license.type);
};

const DeletePopup = (props: { row: AdminBeer, open: boolean, onClose: () => void }) => {
  let { row, open, onClose } = props
  let popupProps: AlertPromptProps = {
    title: `Deleting ${row.name}`,
    contentText: `You are trying to delete ${row.name} ${row.size}ml. This cannot be undone.`,
    open: open,
    onClose: onClose,
    asyncRequest: () => remove("/admin/beers/" + row.id, null),
    submitButtonText: "Delete Beer"
  }

  return (
    <CustomPopup {...popupProps} />
  )
}

function Row(props: RowProps) {
  const { row, refetch, isSelected, handleSelect } = props;
  const [open, setOpen] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const classes = useRowStyles();


  const handleDelete = () => {
    setDeletePopup(false);
    refetch();
  }

  return (
    <React.Fragment>
      <TableRow className={classes.root} selected={isSelected(row)} onClick={() => handleSelect(row)}>
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
        <TableCell>{row.availableByDefault ? "Yes" : "No"}</TableCell>
        <TableCell>{row.defaultPrice}</TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => setDeletePopup(true)}
          > <DeleteIcon />
          </IconButton>
          <DeletePopup row={row} open={deletePopup} onClose={() => { handleDelete() }} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>License Type</TableCell>
                    <TableCell>Price (BGN)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.priceModels.map((priceModelRow, i) => (
                    <TableRow key={`${priceModelRow.licenseType}-${i}`}>
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
  const history = useHistory();
  const { data, isLoading, error, refetch } = useQuery<AdminBeer[]>(
    "AdminBeer",
    getBeers
  );
  const [selected, setSelected] = useState<AdminBeer | undefined>();
  const handleSelect = (beer: AdminBeer) => {
    if (beer === selected) {
      setSelected(undefined);
    } else {
      setSelected(beer);
    }
  }
  const isSelected = (beer: AdminBeer) => selected !== undefined && selected.id === beer.id;


  if (getGlobalToken() === undefined || !getGlobalIsAdmin()) {
    history.push({ pathname: "/", state: { hasExpired: true } })
  }

  if (isLoading && !data) return <LinearProgress />;
  if (error) return <div> Something went wrong... {error} </div>;


  return (
    <Wrapper>
      <CustomAppBar />
      <Box display="flex">
        <AdminBeerCreateView {...{ refetch, getLicenseTypes }} />
        <AdminBeerEditView {...{ refetch, getLicenseTypes, selected }} />
      </Box>
      <AdminTableView {...{ data, refetch, handleSelect, isSelected }} />
    </Wrapper>
  );
};

const AdminTableView = (props: TableProps) => {
  const { data, refetch, handleSelect, isSelected } = props;
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
          {data?.map((row, i) => (
            <Row key={`${row.name}-${i}`} {...{ row, refetch, handleSelect, isSelected }} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminBeerView;
