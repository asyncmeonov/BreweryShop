//Types
import { AdminOrder, BeerType } from '../interfaces';
import { Box, Button, Card, CardContent, Collapse, Container, IconButton } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { formatPrice } from '../../window';
import { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import { AlertPromptProps } from '../types';
import { put } from '../Http';
import { CustomPopup } from '../../Alert';
import AdminOrderEditView from './AdminOrderEditView';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 500,
            minWidth: 500
        },
        internalRoot: {
            minWidth: 350,
            marginBottom: 5
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        flexBox: {
            display: "flex"
        },
        incomplete: {
            backgroundColor: "#ff6961"
        },
        complete: {
            backgroundColor: "#77dd77"
        },
        paragraph : {
            marginBottom: 5
        }
    }),
)

const CompletePopup = (props: { order: AdminOrder, open: boolean, onClose: () => void }) => {
    let { order, onClose, open } = props;
    let internalProps: AlertPromptProps = {
        title: `Confirm order complete`,
        contentText: `Do you want to complete ${order.id} placed by ${order.pirateName} on ${order.dateCreated}? This cannot be undone!`,
        submitButtonText: "Yes, Complete Order",
        open: open,
        onClose: onClose,
        asyncRequest: () => put("/admin/order/complete/" + order.id, null),
    }

    return (
        <CustomPopup {...internalProps} />
    )
}

const OrderBeerDetailCard = (orderBeer: BeerType) => {
    const classes = useStyles();
    return (
        <Card className={classes.internalRoot}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {orderBeer.id}
                </Typography>
                <Typography variant="h5" component="h2">
                    {orderBeer.name} {orderBeer.size}ml
                </Typography>
                <Typography className={classes.pos} color="textPrimary">
                    Quantity: {orderBeer.amount}
                </Typography>
                <Typography color="textSecondary">
                    Price per bottle: {formatPrice(orderBeer.price)} lev
                </Typography>
            </CardContent>
        </Card>
    )
}


const OrderDetails = (props: { order: AdminOrder, toggleView: () => void, refetch: () => {} }) => {
    const { order, toggleView, refetch } = props;
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [completePopup, setCompletePopup] = useState(false);

    const handleCardExpand = () => setExpanded(!expanded);

    const handleComplete = () => {
        setCompletePopup(false);
        toggleView();
        refetch();
    }


    return (
        <Container maxWidth="lg" className={classes.root}>
            <Typography color="textSecondary">{order.id}</Typography>
            {order.dateCompleted && <Typography className={classes.complete}>Status: completed on {order.dateCompleted}</Typography>}
            {!order.dateCompleted && <Typography className={classes.incomplete}>Status: not yet completed</Typography>}

            <Typography>Date placed {order.dateCreated}</Typography>

            <Box className={classes.paragraph}>
                <Typography color="textSecondary">Order placed by</Typography>
                <Typography variant="h4">{order.pirateName}</Typography>
            </Box>


            <Box className={classes.paragraph}>
                <Typography color="textSecondary">Contact Details</Typography>
                <Typography variant="body1">{order.pirateContact}</Typography>
            </Box>


            <Box className={classes.paragraph}>
                <Typography color="textSecondary">License used</Typography>
                <Typography variant="h5">{order.licenseType} {order.license}</Typography>
            </Box>



            <Box className={classes.flexBox}>
                <Typography color="textSecondary">Notes</Typography>
                <AdminOrderEditView {...{ selected: order, refetch }} />
            </Box>
            <Typography variant="body1">{order.notes}</Typography>


            <Box className={classes.flexBox}>
                <Typography
                    variant="h2">
                    Total {formatPrice(order.total)}
                </Typography>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={() => handleCardExpand()}
                    aria-expanded={expanded}
                    aria-label="show more">
                    <ExpandMoreIcon />
                </IconButton>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                {order.orderBeers.map((beer, i) => (<OrderBeerDetailCard key={`order-beer-${i}`} {...beer} />))}
            </Collapse>
            <Button
                size="medium"
                disableElevation
                variant="contained"
                // eslint-disable-next-line eqeqeq
                disabled={order.dateCompleted != undefined}
                onClick={() => setCompletePopup(true)}
            >Complete order
            </Button>
            <CompletePopup order={order} open={completePopup} onClose={() => handleComplete()} />
        </Container>
    )
}

export default OrderDetails;