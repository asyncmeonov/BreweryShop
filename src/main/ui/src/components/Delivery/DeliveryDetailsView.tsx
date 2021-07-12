import LinearProgress from "@material-ui/core/LinearProgress";
import { AdminOrder, Delivery } from '../interfaces';
import { Box, Button, Collapse, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { formatPrice } from '../../window';
import { useState } from 'react';
import React from 'react';
import { get, getCsv, post } from '../Http';
import { useQuery } from 'react-query';

type RowProps = {
    row: AdminOrder
}

type TableProps = {
    data: AdminOrder[] | undefined
}
const useRowStyles = makeStyles({
    root: {
        "& > *": {
            borderBottom: "unset",
        },
    },
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paragraph: {
            marginBottom: 5
        }
    }),
)

const getOrdersForDelivery = async (deliveryId: string): Promise<AdminOrder[]> =>
    get<AdminOrder[]>("/admin/order/" + deliveryId);

const downloadAsCsv = async (delivery: Delivery) =>
    getCsv("/admin/order/delivery/export-csv/" + delivery.id)
        .then(csv => {
            csv.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', delivery.deliveryDate+"_"+delivery.id+".csv");
                document.body.appendChild(link);
                link.click();
            })

        });

function Row(props: RowProps) {
    const { row } = props;
    const [open, setOpen] = useState(false);
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
                    {row.id}
                </TableCell>
                <TableCell>{formatPrice(row.total)}</TableCell>
                <TableCell>{row.pirateName}</TableCell>
                <TableCell>{row.pirateContact}</TableCell>
                <TableCell>{row.notes}</TableCell>
                {/* TODO there are other properties, consider if we need them here. I.e. id, license, etc. */}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Size</TableCell>
                                        <TableCell>Price (single)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.orderBeers.map(beer => (
                                        <TableRow key={`${beer.id}`}>
                                            <TableCell component="th" scope="row">
                                                {beer.amount}
                                            </TableCell>
                                            <TableCell>
                                                {beer.name}
                                            </TableCell>
                                            <TableCell>
                                                {beer.size}
                                            </TableCell>
                                            <TableCell>
                                                {formatPrice(beer.price)}
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

const DeliveryOrderTable = (props: TableProps) => {
    const { data } = props
    return (
        <TableContainer component={Paper}>
            <Table aria-label="delivery order table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Order №</TableCell>
                        <TableCell>Total Cost (BGN)</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Delivery Contact</TableCell>
                        <TableCell>Admin Notes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.map((row, i) => (
                        <Row key={`${row.id}`} {...{ row }} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};


const DeliveryDetails = (props: { delivery: Delivery, toggleView: () => void }) => {
    const { data, isLoading, error } = useQuery<AdminOrder[]>(
        "AdminOrder[]",
        () => getOrdersForDelivery(delivery.id)
    );
    const { delivery } = props;
    const classes = useStyles();

    if (isLoading && !data) return <LinearProgress />;
    if (error) return <div> Something went wrong... {error} </div>;

    return (
        <Container>
            <Typography color="textSecondary">{delivery.id}</Typography>

            <Button
                size="small"
                disableElevation
                variant="contained"
                // eslint-disable-next-line eqeqeq
                onClick={() => { downloadAsCsv(delivery) }}
            >Export Order as CSV
            </Button>

            <Typography>Date to be delivered {delivery.deliveryDate}</Typography>

            <Box className={classes.paragraph}>
                <Typography color="textSecondary">Assigned Distributor</Typography>
                <Typography variant="h4">{delivery.distributor}</Typography>
            </Box>


            <Box className={classes.paragraph}>
                <Typography color="textSecondary">Current Capacity</Typography>
                <Typography variant="body1">{delivery.bookedOrders.length}/{delivery.maxCapacity}</Typography>
            </Box>

            <DeliveryOrderTable {...{ data }} />
        </Container>
    )
}

export default DeliveryDetails;