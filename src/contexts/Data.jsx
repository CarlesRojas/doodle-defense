import { createContext, useRef } from "react";

const APP_NAME = "doodleDefense";

export const Data = createContext();
const DataProvider = (props) => {
    return (
        <Data.Provider
            value={{
                APP_NAME,
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
