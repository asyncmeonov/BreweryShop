//Components
import LinearProgress from "@material-ui/core/LinearProgress";
//styles
import { Delivery, DeliveryRequest } from "../interfaces";
import { get, post } from "../Http";
import { DataGrid, GridColDef, GridRowSelectedParams } from "@material-ui/data-grid";
import CustomAppBar from "../CustomAppBar";
import { useQuery } from "react-query";
import { getGlobalIsAdmin, getGlobalToken } from "../../window";
import { useState } from "react";
import { Box, Button, Drawer, FormControl, FormHelperText, Input, InputLabel, makeStyles, TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import DeliveryDetails from "./DeliveryDetailsView";

const useStyles = makeStyles({
    paper: {
      width: "75%"
    }
  });
  
const getDeliveries = async (): Promise<Delivery[]> =>
    get<Delivery[]>("/admin/delivery");

const postDelivery = async (req: DeliveryRequest) =>
    await post("/admin/delivery/", req);

const DeliveryView = () => {
    const styles = useStyles();
    const { data, isLoading, error, refetch } = useQuery<Delivery[]>(
        "Delivery",
        getDeliveries
    );

    const [selected, setSelected] = useState<Delivery | undefined>();
    const [isDetailViewOpen, setDetailViewOpen] = useState(false);
    const [capacity, setCapacity] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const history = useHistory();

    const toggleDetailView = () => setDetailViewOpen(!isDetailViewOpen);

    const handleRowSelect = (row: GridRowSelectedParams) => {
        let id = (row.data as Delivery).id;
        let selected = data?.find(delivery => delivery.id === id);
        setSelected(selected);
        setDetailViewOpen(true);
    }

    const handleCreateDelivery = async () => {
        let response = postDelivery({ maxCapacity: Number(capacity), deliveryDate: new Date(deliveryDate) });
        if (await response) refetch();
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Delivery №', width: 150, hide: true },
        { field: 'deliveryDate', headerName: 'Date to deliver', width: 150 },
        { field: 'distributor', headerName: 'Distributor Name', width: 150 },
        { field: 'maxCapacity', headerName: 'Capacity', width: 150 },
        { field: "bookedOrders", headerName: "Orders", width: 1000 }
    ];

    if (getGlobalToken() === undefined || !getGlobalIsAdmin()) {
        history.push({ pathname: "/", state: { hasExpired: true } })
    }
    if (isLoading && !data) return <LinearProgress />;
    if (error) return <div> Something went wrong... {error} </div>;

    const rows = data?.map(row => {
        return {
            id: row.id,
            deliveryDate: row.deliveryDate,
            distributor: row.distributor,
            maxCapacity: row.maxCapacity,
            bookedOrders: row.bookedOrders
        };
    });

    return (
        <Box>
            <CustomAppBar />
            <Box display="flex">
                <Box flex="1" marginRight="15px">
                    <DataGrid
                        rows={rows ? rows : []}
                        columns={columns}
                        autoHeight
                        autoPageSize
                        onRowSelected={row => handleRowSelect(row)}
                    />
                    <Drawer
                        classes={{ paper: styles.paper }}
                        anchor="right"
                        open={isDetailViewOpen}
                        onClose={() => toggleDetailView()}
                    >
                        {selected && <DeliveryDetails {...{ delivery: selected, toggleView: toggleDetailView }} />}
                    </Drawer>
                </Box>
                <Box marginRight="15px">
                    <FormControl>
                        <InputLabel htmlFor="type" required={true}>
                            Capacity
                        </InputLabel>
                        <Input
                            type="number"
                            onChange={(e) => setCapacity(e.target.value)}
                        />
                        <FormHelperText>
                            Maximum Orders that can be added to this delivery
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
                            onChange={(e) => setDeliveryDate(e.target.value)}
                        />
                        <FormHelperText id="pirate-contact-helper-text">
                            Make sure its in the future!
                        </FormHelperText>
                    </FormControl>
                    <br />
                    <Button
                        size="large"
                        disableElevation
                        variant="contained"
                        disabled={deliveryDate.length < 1 || capacity.length < 1}
                        onClick={() => handleCreateDelivery()}
                    >
                        Create Delivery
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default DeliveryView;
