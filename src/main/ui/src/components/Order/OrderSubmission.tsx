import { Container } from '@material-ui/core';


type SubmissionProps = {
  isSuccessful: boolean,
  message: string
}

const OrderSubmission = (props: SubmissionProps) => {
  const {isSuccessful, message} = props;
  return (
      <Container maxWidth="sm">
        {
          isSuccessful && (
            <div>
              <h1>Order was received!</h1>
              <div>{message}</div>
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
        <div>Go back to the <a href="/">homepage</a></div>
      </Container>
  );
};

export default OrderSubmission;