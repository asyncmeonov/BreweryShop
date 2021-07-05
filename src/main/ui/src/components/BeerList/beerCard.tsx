import Button from '@material-ui/core/Button';
import { formatPrice } from '../../window';
// Types
import {BeerType} from '../interfaces';
// Style
import {Wrapper, BeerCardDiv} from './beerCard.style';

type Props = {
    beer: BeerType;
    addToCart: (selectedItem: BeerType) => void; 
}

const BeerCard: React.FC<Props> = ({beer, addToCart}) => {
    let isOutOfStock = beer.amountAvailable <= 0
    return (
    <Wrapper>
        <BeerCardDiv>
            <img src={beer.label} alt="beer label"></img>
        </BeerCardDiv>
        <BeerCardDiv style={{flex:1}}>
            <h4><i>{beer.amountAvailable} left</i></h4>
            <h3>{beer.name}</h3>
            <h3>{beer.size}ml</h3>
            <h3>{formatPrice(beer.price)} lev</h3>
            <p>{beer.description}</p>
        </BeerCardDiv>
        <BeerCardDiv>
            <Button 
            style={{flex: 1, alignSelf: "stretch"}}
            disabled = {isOutOfStock}
            onClick={() => addToCart(beer)}>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</Button>
        </BeerCardDiv>
    </Wrapper>
)
}

export default BeerCard;