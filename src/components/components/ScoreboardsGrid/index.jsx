import React, { useEffect, useReducer, useState } from "react";
import classes from "./scoreboards-grid.module.scss";
import Scoreboard from "../Scoreboard";
import useInterval from "../../hooks/useInterval";
import MessageBoard from "../MessageBoard";
import Profile from "../Profile";
import ScoresReducer, {
  actionTypes,
  initialState,
  fetchMatches,
} from "./ScoresReducer";
import useRandomInterval from "../../hooks/useRandomInterval";
import { areAllGamesFinished, getRandomInt } from "../../utils";
import useTimeout from "../../hooks/useTimeout";
import { fetchGroupsFireStore } from "../../../services/firebase";
import BetPage from "../BetPage";
import Leaderboard from "../Leaderboard/Leaderboard";
const TIME_BEFORE_GAMES_START = 0; // seconds
const PLAYING_TIME = 1800000; // milliseconds
const ScoreboardsGrid = ({ PageInd, setPageInd }) => {
  const [timeElapsed, setTimeElapsed] = useState(TIME_BEFORE_GAMES_START);
  const [state, dispatch] = useReducer(ScoresReducer, initialState);
  const [isPlayingTime, setIsPlayingTime] = useState(true);
  const [groups, setGroups] = useState([]);
  const [pairScoreGlobal, setPairScoreGlobal] = useState({});
  const [statusGlobal, setStatusGlobal] = useState("");
  const [dayGlobal, setDayGlobal] = useState("");

  //const pairScore, status, day
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

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await fetchGroupsFireStore();
        setGroups(fetchedGroups.data ?? []);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  // Start games in random moment of time
  const minGameId = 0;
  const maxGameId = games.length - 1;
  const delay = [3000, 4000];
  const cancelUpdateGameState = useRandomInterval(() => {
    /*if (isPlayingTime) {
      const gameId = getRandomInt(minGameId, maxGameId);
      dispatch({ type: actionTypes.START_GAME, data: { gameId } });
    } else {
      const gameId = getRandomInt(minGameId, initialState.games.length - 1);
      dispatch({ type: actionTypes.FINISH_GAME, data: { gameId } });
    }*/
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

  const getGameStatus = (isGameStarted) => (isGameStarted ? "Playing" : "");

  const getScoreBoardStateMessage = () =>
    areAllGamesFinished(games) ? "Summary" : "Current Games";

  const [date, setDate] = useState(new Date());

  const [formattedDate, setFormattedDate] = useState(
    date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  );

  function prevDay() {
    setDate(new Date(date.setDate(date.getDate() - 1)));
    setFormattedDate(
      date.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );
  }

  function nextDay() {
    setDate(new Date(date.setDate(date.getDate() + 1)));
    setFormattedDate(
      date.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );
  }
  return (
    <>
      {timeElapsed === 0 && PageInd === 0 ? (
        <>
          <MessageBoard message={getScoreBoardStateMessage()} />
          <span onClick={prevDay} className={classes.time}>
            {"<"}--
          </span>
          Date : {formattedDate}
          <span onClick={nextDay} className={classes.time}>
            --{">"}
          </span>
          <div className={classes.grid}>
            {gamesToRender.map((pairScore) => (
              <Scoreboard
                key={pairScore.gameId}
                pairScore={pairScore}
                day={formattedDate}
                PageInd={PageInd}
                setPageInd={setPageInd}
                setPairScoreGlobal={setPairScoreGlobal}
                setStatusGlobal={setStatusGlobal}
                setDayGlobal={setDayGlobal}
                //change date format to dd.mm.yyyy
                status={getGameStatus(pairScore.startedGame)}
              />
            ))}
          </div>
        </>
      ) : PageInd === 1 ? (
        <>
          <div className={classes.grid} key={1}>
            {groups.length > 0 ? (
              Object.values(groups).map((group, groupIndex) => (
                <table key={groupIndex}>
                  <thead>
                    <h3>
                      {groupIndex === 0
                        ? "A Grubu"
                        : groupIndex === 1
                        ? "B Grubu"
                        : groupIndex === 2
                        ? "C Grubu"
                        : "D Grubu"}
                    </h3>
                    <tr>
                      <th>Takım</th>
                      <th>O</th>
                      <th>G</th>
                      <th>M</th>
                      <th>A</th>
                      <th>P</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(group).map((team, teamIndex) => (
                      <tr key={teamIndex}>
                        {team.map((row, rowIndex) => (
                          <td key={rowIndex}>{row}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))
            ) : (
              <p>Loading groups...</p>
            )}
          </div>
        </>
      ) : PageInd === 2 ? (
        <BetPage
          PageInd={PageInd}
          setPageInd={setPageInd}
          pairScoreGlobal={pairScoreGlobal}
          setPairScoreGlobal={setPairScoreGlobal}
          statusGlobal={statusGlobal}
          setStatusGlobal={setStatusGlobal}
          dayGlobal={dayGlobal}
          setDayGlobal={setDayGlobal}
        />
      ) : PageInd === 3 ? (
        <Profile />
      ) : PageInd === 4 ? (
        <Leaderboard />
      ) : (
        <MessageBoard
          message={`Games are about to start in ${timeElapsed} seconds.`}
        />
      )}
    </>
  );
};

export default ScoreboardsGrid;
