import {create} from 'zustand';

export const useTokenStore = create(set => ({
  token: '',
  setToken: token => set({token}),
}));
