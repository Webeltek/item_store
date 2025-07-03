import { createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setUser(state, action) {
      console.log('userSlice payload', action.payload);
      
      return action.payload
    },
    setAddress(state, action) {
      // Immer tracks mutating field here
      state.address = action.payload.address;
    },
  },
})

// Extract the action creators object and the reducer
const { actions, reducer } = userSlice
// Extract and export each action creator by name
export const { setUser, setAddress } = actions
// Export the reducer, either as a default or named export
export default reducer