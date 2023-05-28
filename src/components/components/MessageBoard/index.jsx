import classes from "./message-board.module.scss";

const Index = ({ message }) => {
    return (
        <div className={classes.message}>
            {message}
        </div>
    );
};

export default Index;
