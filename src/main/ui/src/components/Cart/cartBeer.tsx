import Button from "@material-ui/core/Button";
import { formatPrice } from "../../window";
//Types
import { BeerType } from "../interfaces";
//Styles
import { Wrapper } from "./cartBeer.style";

type Props = {
  beer: BeerType;
  addToCart: (selectedBeer: BeerType) => void;
  removeFromCart: (id: string) => void;
};

const CartBeer: React.FC<Props> = ({ beer, addToCart, removeFromCart }) => (
  <Wrapper>
    <div>
      <h3>{beer.name}<br/>{beer.size}ml</h3>
      <div className="information">
        <p>Price: {beer.price / 100} lev</p>
        <p>Total: {formatPrice(beer.amount * beer.price)} lev</p>
      </div>
      <div className="buttons">
        <Button
          size="small"
          disableElevation
          variant="contained"
          onClick={() => removeFromCart(beer.id)}
        >
          -
        </Button>
      <p>{beer.amount}</p>
        <Button
          size="small"
          disableElevation
          variant="contained"
          onClick={() => addToCart(beer)}
        >
          +
        </Button>
      </div>
    </div>
  </Wrapper>
);

export default CartBeer;
