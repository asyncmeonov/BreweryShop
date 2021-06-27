import { useState } from "react";
//Components
import { FormControl, FormHelperText, Input, InputLabel, FormControlLabel, Checkbox, Button } from "@material-ui/core";
import { Container } from '@material-ui/core';
//styles
import { Wrapper } from "./OrderView.style";
import { BeerType, Order } from "../interfaces";
import { post } from "../Http";
import { useHistory } from "react-router-dom";


function isValidField(field: string | undefined): boolean {
  return field !== undefined && field.length > 0
}


function isInvalidField(field: string | undefined): boolean {
  return !isValidField(field)
}

const OrderView = () => {
  let history = useHistory();
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [isDelivery, setDelivery] = useState(false);
  const [pName, setPirateName] = useState<string | undefined>(undefined);
  const [pContact, setPirateContact] = useState<string | undefined>(undefined);
  const orderedBeers = (history.location.state as {order: BeerType[]}).order


  const postOrder = async(content: Order) => {
    console.log("request body", content)
    let response = await post<string>("/order", content)
    setMessage(response)
  }

  return (
    <Wrapper>
      <Container maxWidth="sm">
        {
          orderedBeers.map(beer => (
            <div>
              x{beer.amount} of {beer.name} {beer.size}ml ({(beer.price / 100).toFixed(2)} bgn each)
            </div>
          ))
        }
        <hr></hr>
        {
          <div>Total: {(orderedBeers.reduce((sum, current) => sum + (current.price * current.amount), 0)/100).toFixed(2)}</div>
        }
       {message && <div>{message}</div>}
        <FormControl>
            <InputLabel htmlFor="pirate-name" required={true}>Pirate Name</InputLabel>
            <Input id="pirate-name" aria-describedby="pirate-name-helper-text"
            onChange={e => setPirateName(e.target.value)}
            inputProps={{ maxLength: 69 }}/>
            <FormHelperText id="pirate-name-helper-text">How are you known in the seas? max 69 characters</FormHelperText>
      </FormControl> <br/>
      <FormControlLabel
        control={
          <Checkbox
            checked={isDelivery}
            onChange={() => setDelivery(!isDelivery)}
            color="primary"
          />
        }
        label="I want a delivery to my door"
      /><br/>
      <FormControl>
            <InputLabel htmlFor="pirate-contact" required={isDelivery}>Pirate Contact</InputLabel>
            <Input 
            id="pirate-contact" 
            aria-describedby="pirate-contact-helper-text" 
            disabled={!isDelivery} 
            multiline
            onChange={e => setPirateContact(e.target.value)}
            inputProps={{ maxLength: 420 }}/>
            <FormHelperText id="pirate-contact-helper-text">How do you want to be contacted for the delivery? max 420 characters</FormHelperText>
      </FormControl><br/>
      <Button
          size="large"
          disableElevation
          variant="contained"
          disabled={(isDelivery && (isInvalidField(pName) || isInvalidField(pContact)))||(!isDelivery && isInvalidField(pName))}
          onClick={() => postOrder({orderBeers: orderedBeers, pirateName: pName as string, pirateContact: pContact })}
        >
          Submit Order
        </Button>
      </Container>
    </Wrapper>
  );
};

export default OrderView;