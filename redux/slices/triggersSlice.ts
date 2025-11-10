import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Triggers {
    authModal: boolean;
    postCreationModal: boolean;
    postViewModal: boolean;
    archivePostConfirmationModal: boolean;
}

const initialState: Triggers = { 
    authModal: false,
    postCreationModal: false,
    postViewModal: false,
    archivePostConfirmationModal: false,
}
const triggersSlice = createSlice({
    name: "triggers",
    initialState,
    reducers: {
        setTrigger: (
            state, 
            action: PayloadAction<{ key: keyof Triggers; value: boolean }>
        ) => { state[action.payload.key] = action.payload.value }
    }
})


export const { setTrigger } = triggersSlice.actions;
export default triggersSlice.reducer;