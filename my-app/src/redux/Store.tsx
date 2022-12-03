import { createStore } from "redux";
import { mainReducer } from "./reducers/MainReducer";

export const store = createStore(mainReducer);