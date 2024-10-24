import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductType } from '../../types';

interface ProductsTypes {
  products: ProductType[];
}

const initialState: ProductsTypes = { 
  products: []
};

// Crear una acción asíncrona para obtener los productos
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    try {
      const response = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data as ProductType[];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
  },
});

export default productsSlice.reducer;
