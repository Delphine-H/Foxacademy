import React from "react";
import Header from "../components/header";
import { fetchUserScore } from "../utils/appUtils";
import Game from "../components/spaceInvaders/Spaceinvader";

const Jeux = () => {
    return (
        <div>
        <Header />
        <h1>Jeux</h1>
        <Game />
        </div>
    );
    }

export default Jeux;
