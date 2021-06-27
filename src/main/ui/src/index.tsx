import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';


const client = new QueryClient();

ReactDOM.render(
  <BrowserRouter>
  <QueryClientProvider client={client}>
      <App />
  </QueryClientProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
