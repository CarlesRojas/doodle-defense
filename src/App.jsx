import { useContext } from "react";

import MainLayout from "./components/layout/MainLayout";
import Portrait from "./components/layout/Portrait";

import { MediaQuery } from "./contexts/MediaQuery";

export default function App() {
    const { isMobile, isMobileSize, isLandscape } = useContext(MediaQuery);

    // #################################################
    //   RENDER
    // #################################################

    // Wrong orientation on phones
    if ((isMobile || isMobileSize) && !isLandscape) return <Portrait />;

    return <MainLayout />;
}
