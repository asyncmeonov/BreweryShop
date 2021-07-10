import { useState } from "react";
//Components
import { FormHelperText, Button, TextField, Box, Checkbox, FormControlLabel, Typography, LinearProgress } from "@material-ui/core";
import { Container } from '@material-ui/core';
import OrderSubmission from "./OrderSubmission";
//styles
import { Wrapper } from "./OrderView.style";
import { BeerType, Order } from "../interfaces";
import { get, post } from "../Http";
import { useHistory } from "react-router-dom";
import { getGlobalToken } from "../../window";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "react-query";
import { parseISO } from "date-fns";
import { CustomSnackbarAlert } from "../../Alert";


const getDeliveryDates = async () => await get<string[]>("/delivery");

const postOrder = async (content: Order, param: string) => await post("/order" + param, content);

const parseDates = (rawDates: string[]): Date[] => rawDates.map(raw => parseDate(raw));

const parseDate = (rawDate: string): Date => {
  return parseISO(rawDate);
}
const OrderView = () => {
  let history = useHistory();
  const { control, handleSubmit, formState: { errors } } = useForm<Order>();
  const { data, isLoading, error } = useQuery<string[]>(
    "Date[]",
    getDeliveryDates
  );
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isDelivery, setIsDelivery] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);

  const orderedBeers = (history.location.state as { order: BeerType[] }).order

  const handlePopupClose = () => {
    setErrorPopupOpen(false);
  }

  const onSubmit = handleSubmit(async (data) => {
    if(isInvalidDeliveryDate()) return
    let param = (!isInvalidDeliveryDate() && isDelivery) ? "?delivery=" + deliveryDate?.toLocaleDateString() : "";
    let response = await postOrder(data, param);
    let responseBody = await response.text();
    if (response.ok) {
      setMessage(responseBody)
      setIsSuccessful(true);
    } else {
      setMessage(`${responseBody} Please try again. If the problem persists, contact us.`)
      setIsSuccessful(false);
    }
  })

  const isInvalidDeliveryDate = () => isDelivery && (deliveryDate === undefined || deliveryDate === null)

  if (getGlobalToken() === undefined) {
    history.push({ pathname: "/", state: { hasExpired: true } })
  }

  if (message) {
    return (
      <Wrapper>
        <OrderSubmission {...{ isSuccessful, message }}></OrderSubmission>
      </Wrapper>
    )
  }

  const formOptions = {
    name: { required: "Name is required" },
    contact: { required: "Contact is required" }
  };

  if (isLoading) {
    return <LinearProgress />;
  } else return (
    <Wrapper>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column">
          <Box>
            <hr />
            {
              orderedBeers.map((beer, i) => (
                <Controller
                  key={`order-beer-${i}`}
                  name={`orderBeers.${i}`}
                  control={control}
                  defaultValue={orderedBeers[i]}
                  rules={formOptions.name}
                  render={({ field }) => (
                    <Box>
                      x{beer.amount} of {beer.name} {beer.size}ml ({(beer.price / 100).toFixed(2)} bgn each)
                    </Box>
                  )}
                />
              ))
            }
            <hr />
          </Box>

          <Box alignSelf="right">Total: {(orderedBeers.reduce((sum, current) => sum + (current.price * current.amount), 0) / 100).toFixed(2)}</Box>

        </Box>
        <Controller
          name="pirateName"
          control={control}
          defaultValue=""
          rules={formOptions.name}
          render={({ field }) => (
            <TextField
              {...field}
              autoFocus
              margin="dense"
              label="Your Name"
              fullWidth
              inputProps={{ maxLength: 50 }}
              InputLabelProps={{ required: true }}
              error={errors.pirateName !== undefined}
              helperText={errors.pirateName && errors.pirateName.message}
            />
          )}
        />
        <Controller
          name="pirateContact"
          control={control}
          defaultValue=""
          rules={formOptions.contact}
          render={({ field }) => (
            <Box>
              <TextField
                {...field}
                margin="dense"
                label="Contact"
                fullWidth
                multiline
                inputProps={{ maxLength: 300 }}
                InputLabelProps={{ required: true }}
                error={errors.pirateContact !== undefined}
                helperText={errors.pirateContact && errors.pirateContact.message}
              />
              <FormHelperText>How do you want to be contacted for the delivery?</FormHelperText>
              <FormHelperText>Phone, email or another unique way of contacting is needed to do the delivery.</FormHelperText>
              <FormHelperText><b>Note:</b> we wouldn't be able to deliver if we don't have a meaningful contact</FormHelperText>
            </Box>
          )}
        />
        <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="2em">
          <FormControlLabel
            label="I want a delivery."
            control={
              <Checkbox
                disabled={error !== null}
                checked={isDelivery && error === null}
                onChange={() => setIsDelivery(!isDelivery)}
                color="primary"
              />}
          />
          <Box>
            <Typography variant="subtitle2" color={(isInvalidDeliveryDate())? "error": "textSecondary"}>Delivery Date *</Typography>
            {data &&
              <DatePicker
                disabled={!isDelivery}
                required={isDelivery}
                selected={deliveryDate}
                onChange={(date) => setDeliveryDate(date as Date | undefined)}
                includeDates={parseDates(data)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/MM/yyyy"
              />
            }
          </Box>
        </Box>
        <Button
          size="large"
          disableElevation
          variant="contained"
          onClick={(e) => onSubmit(e)}
        >
          Submit Order
        </Button>
      </Container>
      {error &&
        <CustomSnackbarAlert {...{
          open: errorPopupOpen,
          onClose: handlePopupClose,
          severity: "error",
          contentText: "Currently there is a problem with selecting deliveries. Please refresh the page and if the problem persists, contact us."
        }} />}
    </Wrapper>);
};

export default OrderView;