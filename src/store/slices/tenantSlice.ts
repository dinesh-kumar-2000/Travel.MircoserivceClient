import { tenantService } from '@/services/api/tenantService';
import { Tenant } from '@/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TenantState {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  currentTenant: null,
  tenants: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchTenantBySubdomain = createAsyncThunk(
  'tenant/fetchBySubdomain',
  async (subdomain: string, { rejectWithValue }) => {
    try {
      const response = await tenantService.getTenantBySubdomain(subdomain);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tenant'
      );
    }
  }
);

export const fetchAllTenants = createAsyncThunk(
  'tenant/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tenantService.getAllTenants();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tenants'
      );
    }
  }
);

export const createTenant = createAsyncThunk(
  'tenant/create',
  async (tenant: Partial<Tenant>, { rejectWithValue }) => {
    try {
      const response = await tenantService.createTenant(tenant);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create tenant'
      );
    }
  }
);

export const updateTenant = createAsyncThunk(
  'tenant/update',
  async (
    { id, data }: { id: string; data: Partial<Tenant> },
    { rejectWithValue }
  ) => {
    try {
      const response = await tenantService.updateTenant(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update tenant'
      );
    }
  }
);

export const deleteTenant = createAsyncThunk(
  'tenant/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await tenantService.deleteTenant(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete tenant'
      );
    }
  }
);

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setCurrentTenant: (state, action: PayloadAction<Tenant>) => {
      state.currentTenant = action.payload;
    },
    clearCurrentTenant: (state) => {
      state.currentTenant = null;
    },
    updateCurrentTenant: (state, action: PayloadAction<Partial<Tenant>>) => {
      if (state.currentTenant) {
        state.currentTenant = { ...state.currentTenant, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tenant by subdomain
      .addCase(fetchTenantBySubdomain.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenantBySubdomain.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTenant = action.payload!;
      })
      .addCase(fetchTenantBySubdomain.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch all tenants
      .addCase(fetchAllTenants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllTenants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tenants = action.payload! as any;
      })
      .addCase(fetchAllTenants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create tenant
      .addCase(createTenant.fulfilled, (state, action) => {
        state.tenants.push(action.payload!);
      })
      // Update tenant
      .addCase(updateTenant.fulfilled, (state, action) => {
        const index = state.tenants.findIndex(
          (t) => t.id === action.payload!.id
        );
        if (index !== -1) {
          state.tenants[index] = action.payload!;
        }
        if (state.currentTenant?.id === action.payload!.id) {
          state.currentTenant = action.payload!;
        }
      })
      // Delete tenant
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.tenants = state.tenants.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setCurrentTenant, clearCurrentTenant, updateCurrentTenant } =
  tenantSlice.actions;

export default tenantSlice.reducer;
