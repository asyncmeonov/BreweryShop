import { Route, Switch} from 'react-router-dom';
import GeneratorView from "./components/Admin/GeneratorView";
import BeerView from "./components/BeerList/BeerView";
import Login from "./Login";
import OrderView from "./components/Order/OrderView";
import AdminOrderView from "./components/Admin/AdminOrderView";
import AdminBeerView from './components/Admin/AdminBeerView';

const App = () => {
  return (
    <Switch>
      <Route exact path='/' component={Login}/>
      <Route exact path='/beers' component={BeerView}/>
      <Route exact path='/order' component={OrderView}/>
      <Route exact path='/admin/order' component={AdminOrderView}/>
      <Route exact path='/admin/generate' component={GeneratorView}/>
      <Route exact path='/admin/beers' component={AdminBeerView}/>
    </Switch>
  )
};

export default App;
