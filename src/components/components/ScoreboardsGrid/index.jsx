import { useEffect, useReducer, useState } from "react";

import classes from "./scoreboards-grid.module.scss";
import Scoreboard from "../Scoreboard";
import useInterval from "../../hooks/useInterval";
import MessageBoard from "../MessageBoard";
import ScoresReducer, { actionTypes, initialState, fetchMatches } from "./ScoresReducer";
import useRandomInterval from "../../hooks/useRandomInterval";
import { areAllGamesFinished, getRandomInt } from "../../utils";
import useTimeout from "../../hooks/useTimeout";

const TIME_BEFORE_GAMES_START = 0; // seconds
const PLAYING_TIME = 1800000; // milliseconds
const ScoreboardsGrid = ({PageInd,  setPageInd}) => {
  const [timeElapsed, setTimeElapsed] = useState(TIME_BEFORE_GAMES_START);
  const [state, dispatch] = useReducer(ScoresReducer, initialState);
  const [isPlayingTime, setIsPlayingTime] = useState(true);

  const { games, finishedGames } = state;
  const gamesToRender = games.length > 0 ? games : finishedGames;

  // Initial countdown time interval
  useInterval(() => {
    setTimeElapsed((timeElapsed) => timeElapsed - 1);

    if (timeElapsed === 0) {
      setTimeElapsed(timeElapsed); // stop the timer
    }
  }, 1000);

  useEffect(() => {
    const fetchGames = async () => {
      const { games } = await fetchMatches();
      dispatch({ type: actionTypes.FETCH_GAMES, data: { games } });
    };
    fetchGames();
  }, []);

  // Start games in random moment of time
  const minGameId = 0;
  const maxGameId = games.length - 1;
  const delay = [3000, 4000];
  const cancelUpdateGameState = useRandomInterval(() => {
    if (isPlayingTime) {
      const gameId = getRandomInt(minGameId, maxGameId);
      dispatch({ type: actionTypes.START_GAME, data: { gameId } });
    } else {
      const gameId = getRandomInt(minGameId, initialState.games.length - 1);
      dispatch({ type: actionTypes.FINISH_GAME, data: { gameId } });
    }
  }, ...delay);

  // Start game score updates
  const updateScoreDelay = [3000, 8000];
  const cancelUpdateScoreInterval = useRandomInterval(() => {
    const gameId = getRandomInt(minGameId, maxGameId);
    const teamId = getRandomInt(1, 2);
    dispatch({ type: actionTypes.UPDATE_SCORE, data: { gameId, teamId } });
  }, ...updateScoreDelay);

  if (areAllGamesFinished(games)) {
    console.log(">>> All games finished. Cancel all updates.");
    cancelUpdateGameState();
    cancelUpdateScoreInterval();
  }

  // Start a timeout for when to finish the games
  useTimeout(() => {
    console.log(">>> Playing time ended. Start finalizing the games.");
    setIsPlayingTime(false);
  }, PLAYING_TIME);

  const getGameStatus = (isGameStarted) => isGameStarted ? 'Playing' : '';

  const getScoreBoardStateMessage = () => areAllGamesFinished(games) ? 'Summary' : 'Current Games';

  return (
    <>
      {timeElapsed === 0 && PageInd === 0 ? (
        <>
          <MessageBoard message={getScoreBoardStateMessage()} />
          <div className={classes.grid}>
            {gamesToRender.map((pairScore) => (
              <Scoreboard
                key={pairScore.gameId}
                pairScore={pairScore}
                status={getGameStatus(pairScore.startedGame)}
              />
            ))}
          </div>
        </>
      ) : (PageInd === 1 ?  (
        <>
          {// Add a table for displaying groups
          }
        </>
      ): (
        <MessageBoard message={`Games are about to start in ${timeElapsed} seconds.`} />
      ))}
    </>
  );
};

export default ScoreboardsGrid;
