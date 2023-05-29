import React, { useEffect, useState } from "react";
import TeamView from "../TeamView";
import Result from "../Result";
import GameStatus from "../GameStatus";

import classes from "./betpage.module.scss";
import Footer from "../Footer/index.jsx";
function BetPage({
  PageInd,
  setPageInd,
  pairScoreGlobal,
  setPairScoreGlobal,
  statusGlobal,
  setStatusGlobal,
  dayGlobal,
  setDayGlobal,
}) {
  return (
    <div className={classes.betpage}>
      <main>
        <div className={classes.teams}>
          <div className={classes.teamview}>
            <TeamView teamData={pairScoreGlobal.homeTeam} />
          </div>
          <Result
            className={classes.result}
            homeTeamScore={pairScoreGlobal.homeTeam.score}
            awayTeamScore={pairScoreGlobal.awayTeam.score}
          />
          <GameStatus status={statusGlobal} />
          <div className={classes.teamview}>
            <TeamView teamData={pairScoreGlobal.awayTeam} />
          </div>
        </div>
        <h2>{dayGlobal}</h2>
        <button className={classes.button} onClick={() => setPageInd(0)}>
          Back
        </button>
      </main>
      <Footer />
    </div>
  );
}

export default BetPage;
