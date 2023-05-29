import classes from "./scoreboard.module.scss";
import TeamView from "../TeamView";
import Result from "../Result";
import GameStatus from "../GameStatus";

const Scoreboard = ({
  pairScore,
  status,
  day,
  PageInd,
  setPageInd,
  setPairScoreGlobal,
  setStatusGlobal,
  setDayGlobal,
}) => {
  let eventDate = pairScore.eventDate.split(".");
  eventDate = eventDate[0] + "." + eventDate[1];
  let dayDate = day.split(".");
  dayDate = dayDate[0] + "." + dayDate[1];
  const handleClick = async () => {
    setPairScoreGlobal(pairScore);
    setStatusGlobal(status);
    setDayGlobal(day);
    setPageInd(2);
  };
  return (
    eventDate === dayDate && (
      <div className={classes.score}>
        <section className={classes.scoreboard}>
          <TeamView teamData={pairScore.homeTeam} />
          <main>
            <Result
              homeTeamScore={pairScore.homeTeam.score}
              awayTeamScore={pairScore.awayTeam.score}
            />
            <GameStatus status={status} />
          </main>
          <TeamView teamData={pairScore.awayTeam} />
        </section>
        <button onClick={handleClick}>Bet</button>
      </div>
    )
  );
};

export default Scoreboard;
