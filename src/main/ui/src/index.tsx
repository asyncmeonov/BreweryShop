import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';


const client = new QueryClient();

ReactDOM.render(
  <HashRouter>
  <QueryClientProvider client={client}>
      <App />
  </QueryClientProvider>
  </HashRouter>,
  document.getElementById('root')
);
