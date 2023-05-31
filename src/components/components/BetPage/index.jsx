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
  checkBalanceIsEnough,
} from "../../../services/firebase";
import classes from "./betpage.module.scss";
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
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedTeamForm, setSelectedTeamForm] = useState("");
  const [coin, setCoin] = useState(0);

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
    setLoading(true);
    await createRoomForCurrentUser(
      roomName,
      pairScoreGlobal.gameId,
      selectedTeamForm,
      selectedTeamForm === pairScoreGlobal.homeTeam.name
        ? pairScoreGlobal.awayTeam.name
        : pairScoreGlobal.homeTeam.name,
      pairScoreGlobal.eventDate,
      coin
    );
    await fetchRooms();
    setLoading(false);
  };

  function formControl() {
    if (roomName === "") {
      alert("Please enter room name");
      return false;
    } else if (selectedTeamForm === "") {
      alert("Please select team");
    } else if (checkBalanceIsEnough(coin)) {
      createBet();
      setShowRooms(true);
      setSelectedTeam();
      setRoomName("");
    } else {
      alert("You don't have enough coin");
    }
  }

  const currDate = new Date();
  const currDay = currDate.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  
  const currTime = currDate.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }); 
  
  
console.log(pairScoreGlobal.gameTime)    
  const handleCoin = (e) => {
    setCoin(e.target.value);
  };

  console.log(pairScoreGlobal)
  return (
    <>
      {showRooms === false && (
        <div className={classes.betpage}>
          <main>
            <h2>Oyun: {pairScoreGlobal.gameId}</h2>
            <h2>Match Day: {dayGlobal}</h2>

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
            <h3>Match Starts at: {pairScoreGlobal.gameTime}</h3>
            <form className={classes.formContainer}>
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
              <label> Bet coin: </label>
              <input type="number" name="coin" onChange={handleCoin}></input>
              <button className={classes.button} onClick={formControl}>
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
              style={{ backgroundColor: "red" }}
            >
              Back
            </button>
            <button
              className={classes.button}
              onClick={async () => await fetchRooms()}
            >
              Reload Rooms
            </button>
            <div className={classes.teamButtons}>
              <button
                className={
                  selectedTeam === pairScoreGlobal.homeTeam.name
                    ? classes.teama
                    : classes.teamb
                }
                onClick={() => setSelectedTeam(pairScoreGlobal.homeTeam.name)}
              >
                Bet to {pairScoreGlobal.homeTeam.name}
              </button>
              <button
                className={
                  selectedTeam === pairScoreGlobal.awayTeam.name
                    ? classes.teama
                    : classes.teamb
                }
                onClick={() => setSelectedTeam(pairScoreGlobal.awayTeam.name)}
              >
                Bet to {pairScoreGlobal.awayTeam.name}
              </button>
            </div>
            <div className={classes.rooms}>
              {rooms?.map((room) => (
                <div
                  className={`${classes.room} ${
                    selectedTeam === room.availableTeam ? "" : classes.hidden
                  }`}
                >
                  <h3>{room.name.toUpperCase()}</h3>
                  <p>Creator: {room.creatorName}</p>
                  {room.participantName !== undefined &&
                    room.participantName !== "" &&
                    room.participantName !== null && (
                      <p>Participant: {room.participantName}</p>
                    )}
                  <p>Available Team: {room.availableTeam}</p>
                  <button
                    className={classes.button}
                    onClick={async () => {
                      if (
                        room.participantName === undefined ||
                        room.participantName === "" ||
                        room.participantName === null
                      ) {
                        if (checkBalanceIsEnough(room.coin)) {
                          await addParticipantToRoom(
                            room.id,
                            auth.currentUser.uid
                          );
                          await fetchRooms();
                        }
                      } else {
                        alert("This room is full");
                      }
                    }}
                    style={{
                      backgroundColor:
                        room.participantName === undefined ||
                        room.participantName === "" ||
                        room.participantName === null
                          ? "green"
                          : "red",
                    }}
                  >
                    {room.participantName === undefined ||
                    room.participantName === "" ||
                    room.participantName === null
                      ? "Join"
                      : "Room Full"}
                  </button>
                  {/* date and clock is not started */}
                  {((currTime>=pairScoreGlobal.gameTime && currDay.split(".")[1] == pairScoreGlobal.eventDate.split(".")[1] && currDay.split(".")[0] == pairScoreGlobal.eventDate.split(".")[0]) ) && 
                  <button
                    className={classes.button}
                    onClick={async () => {
                      await leaveRoom(room.id, auth.currentUser.uid, coin);
                      await fetchRooms();
                    }}
                    style={{ backgroundColor: "red" }}
                  >
                    Leave
                  </button>
                  }
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
