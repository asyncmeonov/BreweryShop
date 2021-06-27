import CartBeer from './cartBeer';
//Styles
import {Wrapper} from './cart.style';
//Types
import {BeerType} from '../interfaces';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

type Props = {
    cartBeers: BeerType[];
    addToCart: (selectedItem: BeerType) => void;
    removeFromCart: (id: string) => void;
};

const Cart: React.FC<Props> = ({cartBeers, addToCart, removeFromCart}) => {
    const history = useHistory();

    const calculateTotal = (beers: BeerType[]) =>
     beers.reduce((ack:number, beer) => ack + (beer.amount * beer.price) / 100, 0);


     const handleClick = async () => {
        history.push({
            pathname: "/order",
            state: { order: cartBeers}
        });
     }

    return (
        <Wrapper>
            <h2> Your Shopping Cart</h2>
            {cartBeers.length === 0 ? <p>No beers in cart.</p> : null}
            {cartBeers.map(beer => (
                <CartBeer 
                key={beer.id}
                beer={beer}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                />
            ))}
            <h2>Total: {calculateTotal(cartBeers).toFixed(2)} lev</h2>
            <Button
                size="large"
                disabled={cartBeers.length === 0}
                disableElevation
                variant="contained"
                onClick={handleClick}
             >Submit Order</Button>
        </Wrapper>
    )
}

export default Cart;