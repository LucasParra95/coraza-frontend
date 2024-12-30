import { remove } from 'lodash';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserType = {
  id: string;
  name: string;
  email: string;
  favorites: string[];
};


type ToggleFavType = {
  id: string;
};

interface UserSliceTypes {
  user: UserType | null; // Puedes definir el tipo de datos del usuario más específicamente si tienes un modelo concreto
  favProducts: string[]; // Almacena solo los IDs de los productos favoritos
}

const initialState: UserSliceTypes = {
  user: null, // El usuario comienza como null o vacío
  favProducts: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleFavProduct(state, action: PayloadAction<ToggleFavType>) {
      const isFavorite = state.favProducts.includes(action.payload.id);

      if (!isFavorite) {
        state.favProducts.push(action.payload.id);
        
        return;
      }

      remove(state.favProducts, (id) => id === action.payload.id);
    },
    setUserLogged(state, action: PayloadAction<any>) {
      const  user = action.payload;
      
      return {
        ...state,
        user, // Almacena los datos completos del usuario en el estado
        favProducts: user.favorites || state.favProducts,
      };
    },
    logout(state) {
      return {
        ...state,
        user: null, // Al cerrar sesión, se borra el usuario
        favProducts: [], // También se limpian los productos favoritos
      };
    },
  },
});

export const { toggleFavProduct, setUserLogged, logout } = userSlice.actions;
export default userSlice.reducer;
