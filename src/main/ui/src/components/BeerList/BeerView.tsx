import { useState } from "react";
import { useQuery } from "react-query";
//Components
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShopingCartIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";
import BeerCard from "./beerCard";
import Cart from "../Cart/cart";
import CustomAppBar from "../CustomAppBar";
//styles
import { Wrapper, StyledButton } from "./BeerView.style";
import { BeerType } from "../interfaces";
import { get } from "../Http";
import { getGlobalToken } from "../../window";

const getProducts = async (): Promise<BeerType[]> => get<BeerType[]>("/beers")

const BeerView = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartBeers, setCartBeers] = useState([] as BeerType[]);
  const { data, isLoading, error } = useQuery<BeerType[]>("beers", getProducts);

  if (getGlobalToken() === undefined) {
    return (
      <Wrapper>
        <div>Session has expired. Go back to the <a href="/">homepage</a></div>
      </Wrapper>
    );
  }

  const getTotalItems = (beers: BeerType[]) =>
    beers.reduce((ack: number, beer) => ack + beer.amount, 0);

  const addToCart = (selectedBeer: BeerType) => {
    setCartBeers((prev) => {
      //Is the item already added in the cart?
      const isBeerInCart = prev.find((beer) => beer.id === selectedBeer.id);

      if (isBeerInCart) {
        return prev.map((beer) =>
          beer.id === selectedBeer.id
            ? { ...beer, amount: beer.amount + 1 }
            : beer
        );
      }
      // First time a beer is added to the cart
      return [...prev, { ...selectedBeer, amount: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartBeers((prev) =>
      prev.reduce((ack, beer) => {
        if (beer.id === id) {
          if (beer.amount === 1) return ack;
          return [...ack, { ...beer, amount: beer.amount - 1 }];
        } else {
          return [...ack, beer];
        }
      }, [] as BeerType[])
    );
  };
  if (isLoading) return <LinearProgress />;
  if (error) return <div> Something went wrong... </div>;
  return (
    <div>
      <CustomAppBar {...{
        button: <StyledButton onClick={() => setIsCartOpen(true)}>
          <Badge badgeContent={getTotalItems(cartBeers)} color="error">
            <AddShopingCartIcon />
          </Badge>
        </StyledButton>
      }} />
      <Wrapper>
        <Drawer
          anchor="right"
          open={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        >
          <Cart
            cartBeers={cartBeers}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        </Drawer>
        <Grid container spacing={3}>
          {data?.map((beer) => (
            <Grid item key={beer.id} xs={12}>
              <BeerCard beer={beer} addToCart={addToCart} />
            </Grid>
          ))}
        </Grid>
      </Wrapper>
    </div>
  );
};

export default BeerView;
