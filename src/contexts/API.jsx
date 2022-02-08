import { createContext } from "react";

// const API_VERSION = "api_v1";
// const API_URL = "https://doodle-defense.herokuapp.com/"; // "http://localhost:3100/";

export const API = createContext();
const APIProvider = (props) => {
    return <API.Provider value={{}}>{props.children}</API.Provider>;
};

export default APIProvider;
