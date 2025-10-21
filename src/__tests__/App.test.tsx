import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import authReducer from '../store/slices/authSlice';
import tenantReducer from '../store/slices/tenantSlice';
import themeReducer from '../store/slices/themeSlice';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    theme: themeReducer,
  },
});

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
  });
});

