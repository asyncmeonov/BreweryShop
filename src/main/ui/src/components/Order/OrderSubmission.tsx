import { Button, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';


type SubmissionProps = {
  isSuccessful: boolean,
  message: string
}

const OrderSubmission = (props: SubmissionProps) => {
  const history = useHistory();
  const { isSuccessful, message } = props;
  return (
    <Container maxWidth="sm">
      {
        isSuccessful && (
          <div>
            <h1>Order was received!</h1>
            <div>{message}</div>
            <h3>Your order number is the confirmation for your order. Make sure you write it down</h3>
          </div>
        )
      }
      {
        !isSuccessful && (
          <div>
            <h1>There was a problem with the order!</h1>
            <div>{message}</div>
          </div>
        )
      }
      <Button onClick={() => history.push("/beers")}>
        Go back to beer page
      </Button>
    </Container>
  );
};

export default OrderSubmission;