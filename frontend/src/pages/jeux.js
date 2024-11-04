import React from "react";
import Header from "../components/header";
import { fetchUserScore } from "../utils/appUtils";
import Game from "../components/spaceInvaders/Spaceinvader";
import Footer from "../components/footer";

const Jeux = () => {
    return (
        <div>
        <Header />
        <h1>Jeux</h1>
        <Game />
        <Footer />
        </div>
    );
    }

export default Jeux;
