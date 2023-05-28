import classes from "./game-status.module.scss";

const GameStatus = ({ status }) => {
    return (
        <div className={classes.status}>
            {status}
        </div>
    );
};

export default GameStatus;
