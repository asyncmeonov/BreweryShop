import { useState } from "react";
import { useQuery } from "react-query";
//Components
import LinearProgress from "@material-ui/core/LinearProgress";
//styles
import { Wrapper } from "./GeneratorView.styles";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  TextField,
} from "@material-ui/core";
import { License } from "../interfaces";
import CustomAppBar from "../CustomAppBar";
import { get, post, remove } from "../Http";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  DataGrid,
  GridColDef,
  GridRowSelectedParams,
} from "@material-ui/data-grid";

type LicenseRow = {
  id: string
  type: string
  expiryDate: Date
}

const getLicenses = async (): Promise<License[]> =>
  get<License[]>("/admin/license");

const postLicense = async (type: string, expires: string) =>
  await post(
    "/admin/license/" +
    type +
    (expires.length > 0 ? "?expires=" + expires : ""),
    null
  );

const deleteLicense = async (type: string) =>
  await remove("/admin/license/" + type, null);

const GeneratorView = () => {
  const { data, isLoading, error, refetch } = useQuery<License[]>("License", getLicenses);
  const [type, setType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const handleClick = async () => {
    let response = postLicense(type, expiryDate);
    if(await response) refetch();
  };

  const handleDelete = async (type: string) => {
    let response = deleteLicense(type);
    if(await response) refetch();
  }

  const [selectedRows, setSelectedRows] =
    useState<GridRowSelectedParams | undefined>(undefined);

  const columns: GridColDef[] = [
    { field: "id", headerName: "License", width: 150 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "expiryDate", headerName: "Expiry Date", width: 150 },
  ];

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
  if (isLoading) return <LinearProgress />;
  if (error) return <div> Something went wrong... {error} </div>;

  const rows = data?.map(row => {
    return {
      id: row.license,
      type: row.type,
      expiryDate: row.expiryDate
    };
  }).filter(row => row.id !== undefined) as LicenseRow[];

  return (
    <Wrapper>
      <CustomAppBar />
      <Container>
        <Box display="flex" justifyContent="space-between">
          <Box flex="1" style={{ marginRight: "15px" }}>
            <IconButton
              aria-label="delete"
              disabled={selectedRows === null}
              onClick={() => { handleDelete(selectedRows?.data.id) }}
            >
              <DeleteIcon />
            </IconButton>
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight
              autoPageSize
              onRowSelected={(newSelection) => {
                setSelectedRows(newSelection);
              }}
            />
          </Box>
          <Box>
            <FormControl>
              <InputLabel htmlFor="type" required={true}>
                License Type
              </InputLabel>
              <Input
                id="type"
                aria-describedby="type-helper-text"
                onChange={(e) => setType(e.target.value)}
                inputProps={{ maxLength: 18 }}
              />
              <FormHelperText id="pirate-name-helper-text">
                No spaces and only underscores allowed.
              </FormHelperText>
            </FormControl>
            <br />
            <FormControl>
              <TextField
                id="date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
              <FormHelperText id="pirate-contact-helper-text">
                If left blank, license will never expire
              </FormHelperText>
            </FormControl>
            <br />
            <Button
              size="large"
              disableElevation
              variant="contained"
              disabled={type.length < 1}
              onClick={() => handleClick()}
            >
              Create License
            </Button>
          </Box>
        </Box>
      </Container>
    </Wrapper>
  );
};

export default GeneratorView;
