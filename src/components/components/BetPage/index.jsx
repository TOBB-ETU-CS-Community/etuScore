import React, { useEffect, useState } from "react";
import TeamView from "../TeamView";
import Result from "../Result";
import GameStatus from "../GameStatus";
import {
  createRoom,
  createRoomForCurrentUser,
  addParticipantToRoom,
  getRoomsByActiveMatchId,
  leaveRoom,
} from "../../../services/firebase";
import classes from "./betpage.module.scss";
import Footer from "../Footer/index.jsx";
import { auth, db } from "../../../services/firebase";
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
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(0);
  const [selectedTeamForm, setSelectedTeamForm] = useState("");

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };
  const handleTeam = (e) => {
    setSelectedTeamForm(e.target.value);
  };
  const fetchRooms = async () => {
    //fetch rooms from pairScoreGlobal.gameId
    const rooms = await getRoomsByActiveMatchId(pairScoreGlobal.gameId);
    setRooms(rooms);
    console.log(rooms);
  };
  useEffect(() => {
    const fetchRooms = async () => {
      //fetch rooms from pairScoreGlobal.gameId
      const rooms = await getRoomsByActiveMatchId(pairScoreGlobal.gameId);
      setRooms(rooms);
      console.log(rooms);
    };
    if (PageInd === 2) {
      fetchRooms();
    }
  }, [pairScoreGlobal.gameId, PageInd]);
  const createBet = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await createRoomForCurrentUser(
      roomName,
      pairScoreGlobal.gameId,
      selectedTeamForm,
      selectedTeamForm === pairScoreGlobal.homeTeam.name ? pairScoreGlobal.awayTeam.name : pairScoreGlobal.homeTeam.name
    );
    console.log(response);
    await fetchRooms();
    setLoading(false);
  };
  return (
    <>
      {showRooms === false && (
        <div className={classes.betpage}>
          <main>
            <h2>Oyun: {pairScoreGlobal.gameId}</h2>

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
            <form onSubmit={createBet} className={classes.formContainer}>
              <input
                type="text"
                placeholder="Enter room name"
                value={roomName}
                onChange={handleRoomNameChange}
                className={classes.input}
              />
              <div className={classes.formRadio}>
                <label>Play Bet To: </label>
                <input
                  type="radio"
                  name="team"
                  value={pairScoreGlobal.homeTeam.name}
                  onChange={handleTeam}
                />
                {pairScoreGlobal.homeTeam.name}
                <input
                  type="radio"
                  name="team"
                  value={pairScoreGlobal.awayTeam.name}
                  onChange={handleTeam}
                />
                {pairScoreGlobal.awayTeam.name}
              </div>
              <button className={classes.button} type="submit">
                Create Bet
              </button>
            </form>
            <button
              className={classes.button}
              onClick={() => setShowRooms(true)}
            >
              Rooms
            </button>
            <button className={classes.button} onClick={() => setPageInd(0)}>
              Back
            </button>
          </main>
        </div>
      )}
      {showRooms === true && (
        <div className={classes.roomsPage}>
          <main className={classes.mainPart}>
            <button
              className={classes.button}
              onClick={() => setShowRooms(false)}
            >
              Match İnformation
            </button>
            <button
              className={classes.button}
              onClick={async () => await fetchRooms()}
            >
              Reload Rooms
            </button>
            <div className={classes.teamButtons}>
              <button
                className={selectedTeam === 0 ? classes.teama : classes.teamb}
                onClick={() => setSelectedTeam(0)}
              >
                Bet to {pairScoreGlobal.homeTeam.name}
              </button>
              <button
                className={selectedTeam === 1 ? classes.teama : classes.teamb}
                onClick={() => setSelectedTeam(1)}
              >
                Bet to {pairScoreGlobal.awayTeam.name}
              </button>
            </div>
            <div className={classes.rooms}>
              {rooms?.map((room) => (
                <div className={classes.room} key={room.id}>
                  <h3>{room.name}</h3>
                  <p>Creator: {room.creatorName}</p>
                  {(room.participantName!== undefined && room.participantName !== "" && room.participantName !== null )&&(<p>Participant: {room.participantName}</p>)}
                  <button
                    className={classes.button}
                    onClick={async () => {
                      await addParticipantToRoom(room.id, auth.currentUser.uid);
                      await fetchRooms();
                    }}
                  >
                    Join
                  </button>
                  <button
                    className={classes.button}
                    onClick={async () => {
                      await leaveRoom(room.id, auth.currentUser.uid);
                      await fetchRooms();
                    }}
                  >
                    Leave
                  </button>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default BetPage;
