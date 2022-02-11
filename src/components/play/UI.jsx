import { useContext, useState, useCallback, useEffect } from "react";
import useGlobalState from "../../hooks/useGlobalState";
import useThrottle from "../../hooks/useThrottle";

import { Events } from "../../contexts/Events";
import { Utils } from "../../contexts/Utils";

import DrawPile from "../../resources/sprites/ui/DrawPile.png";
import DiscardPile from "../../resources/sprites/ui/DiscardPile.png";
import ManaAvailable from "../../resources/sprites/ui/ManaAvailable.png";
import NextRound from "../../resources/sprites/ui/NextRound.png";
import CoinsIcon from "../../resources/sprites/ui/Coin.png";
import HealthBar_Left from "../../resources/sprites/ui/HealthBar_Left.png";
import HealthBar_Middle from "../../resources/sprites/ui/HealthBar_Middle.png";
import HealthBar_Right from "../../resources/sprites/ui/HealthBar_Right.png";
import HealthBar_LeftFilter from "../../resources/sprites/ui/HealthBar_LeftFilter.png";
import HealthBar_MiddleFilter from "../../resources/sprites/ui/HealthBar_MiddleFilter.png";
import HealthBar_RightFilter from "../../resources/sprites/ui/HealthBar_RightFilter.png";

export default function UI() {
    const { emit, sub, unsub } = useContext(Events);
    const { vibrate, clamp } = useContext(Utils);

    const [gameDimensions] = useGlobalState("gameDimensions");

    // #################################################
    //   HANDLERS
    // #################################################

    const handleDrawPileClick = useThrottle(() => {
        vibrate(40);
        emit("drawPileClicked"); // ROJAS do something when this is clicked
    }, 250);

    const handleDiscardPileClick = useThrottle(() => {
        vibrate(40);
        emit("discardPileClicked"); // ROJAS do something when this is clicked
    }, 250);

    const handleNextRoundClick = useThrottle(() => {
        vibrate(40);
        emit("nextRoundClicked"); // ROJAS do something when this is clicked
    }, 250);

    // #################################################
    //   CARD PILES
    // #################################################

    const [drawPile, setDrawPile] = useState(0);
    const [discardPile, setDiscardPile] = useState(0);

    const handleUpdateDrawPile = useCallback((drawPileNum) => {
        setDrawPile(drawPileNum);
    }, []);

    const handleUpdateDiscardPile = useCallback((discardPileNum) => {
        setDiscardPile(discardPileNum);
    }, []);

    // #################################################
    //   HEALTH
    // #################################################

    const [health, setHealth] = useState(60);
    const [totalHealth, setTotalHealth] = useState(100);

    const handleUpdateHealth = useCallback(({ current, total }) => {
        setHealth(current);
        setTotalHealth(total);
    }, []);

    // #################################################
    //   MANA
    // #################################################

    const [mana, setMana] = useState(2);
    const [totalMana, setTotalMana] = useState(4);

    const handleUpdateMana = useCallback(({ current, total }) => {
        setMana(current);
        setTotalMana(total);
    }, []);

    // #################################################
    //   EVENTS
    // #################################################

    useEffect(() => {
        sub("updateDrawPile", handleUpdateDrawPile);
        sub("updateDiscardPile", handleUpdateDiscardPile);
        sub("updateHealth", handleUpdateHealth); // ROJAS IMPLEMENT
        sub("updateMana", handleUpdateMana); // ROJAS IMPLEMENT

        return () => {
            unsub("updateDrawPile", handleUpdateDrawPile);
            unsub("updateDiscardPile", handleUpdateDiscardPile);
            unsub("updateHealth", handleUpdateHealth);
            unsub("updateMana", handleUpdateMana);
        };
    }, [sub, unsub, handleUpdateDrawPile, handleUpdateDiscardPile, handleUpdateHealth, handleUpdateMana]);

    // #################################################
    //   RENDER
    // #################################################

    const { height, width, left, top, cellSize } = gameDimensions;

    const healthPerentage = clamp(health / totalHealth) * 100;
    const cardPileMargin = cellSize * 0.4;

    return (
        <div className="UI">
            <div
                className="gameContainer"
                style={{ height: `${height}px`, width: `${width}px`, left: `${left}px`, top: `${top}px` }}
            ></div>

            <div className="topRow" style={{ height: `${cellSize}px` }}>
                <div className="healthBar" style={{ height: `${cellSize}px`, margin: `0 0 0 ${cellSize / 2}px` }}>
                    <div className="health">
                        <div className="background">
                            <div className="currentHealth" style={{ width: `${healthPerentage}%` }}></div>
                        </div>

                        <div className="left">
                            <img src={HealthBar_LeftFilter} alt="" className="icon filter" />
                            <img src={HealthBar_Left} alt="" className="icon" />
                        </div>

                        <div className="middle">
                            <img src={HealthBar_MiddleFilter} alt="" className="icon filter" />
                            <img src={HealthBar_Middle} alt="" className="icon" />
                        </div>

                        <div className="right">
                            <img src={HealthBar_RightFilter} alt="" className="icon filter" />
                            <img src={HealthBar_Right} alt="" className="icon" />
                        </div>
                    </div>

                    <div className="textContainer">
                        <p
                            className="healthValue"
                            style={{
                                fontSize: `${cellSize * 0.43}px`,
                                marginLeft: `${cellSize * 0.25}px`,
                                marginRight: `${cellSize * 0.07}px`,
                            }}
                        >
                            {health}
                        </p>

                        <p className="healthTotal" style={{ fontSize: `${cellSize * 0.3}px` }}>
                            {`/ ${totalHealth}`}
                        </p>
                    </div>
                </div>

                <div className="coins" style={{ height: `${cellSize}px`, margin: `0 ${cellSize / 2}px` }}>
                    <img src={CoinsIcon} alt="" className="icon" />
                    <p className="coinNumber" style={{ fontSize: `${cellSize * 0.43}px` }}>
                        {625}
                    </p>
                </div>
            </div>

            <div className="secondBottomRow" style={{ height: `${cellSize}px`, bottom: `${cellSize * 2}px` }}>
                <div className="sign" style={{ height: `${cellSize}px`, width: `${cellSize * 2}px` }}>
                    <img src={ManaAvailable} alt="" className="icon" />

                    <div className="textContainers">
                        <p
                            className="currentMana"
                            style={{
                                fontSize: `${cellSize * 0.43}px`,
                                width: `${cellSize * 0.6}px`,
                                lineHeight: `${cellSize * 0.43}px`,
                            }}
                        >
                            {mana}
                        </p>
                        <p
                            className="totalMana"
                            style={{
                                fontSize: `${cellSize * 0.35}px`,
                                width: `${cellSize * 0.47}px`,
                                lineHeight: `${cellSize * 0.35}px`,
                            }}
                        >
                            {totalMana}
                        </p>
                    </div>
                </div>

                <div
                    className="sign"
                    style={{ right: `${cellSize * 0.25}px`, height: `${cellSize}px`, width: `${cellSize * 2}px` }}
                    onClick={handleNextRoundClick}
                >
                    <img src={NextRound} alt="" className="icon" />
                    <p
                        className="nextWave"
                        style={{ fontSize: `${cellSize * 0.35}px`, lineHeight: `${cellSize * 0.35}px` }}
                    >
                        {"Next Wave"}
                    </p>
                </div>
            </div>

            <div className="bottomRow" style={{ height: `${cellSize * 2}px` }}>
                <div
                    className="pile"
                    style={{
                        height: `${cellSize * 2 - cardPileMargin * 2}px`,
                        width: `${cellSize * 2 - cardPileMargin * 2}px`,
                        margin: `${cardPileMargin}px`,
                    }}
                    onClick={handleDrawPileClick}
                >
                    <img src={DrawPile} alt="" className="icon" />
                    <p className="numOfCards" style={{ fontSize: `${cellSize * 0.43}px` }}>
                        {drawPile}
                    </p>
                </div>

                <div
                    className="pile"
                    style={{
                        height: `${cellSize * 2 - cardPileMargin * 2}px`,
                        width: `${cellSize * 2 - cardPileMargin * 2}px`,
                        margin: `${cardPileMargin}px`,
                    }}
                    onClick={handleDiscardPileClick}
                >
                    <img src={DiscardPile} alt="" className="icon" />
                    <p className="numOfCards discard" style={{ fontSize: `${cellSize * 0.43}px` }}>
                        {discardPile}
                    </p>
                </div>
            </div>
        </div>
    );
}
