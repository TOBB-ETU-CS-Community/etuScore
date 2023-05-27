import React from 'react';
import classes from "./result.module.scss";

const Result = ({ homeTeamScore, awayTeamScore }) => {
    return (
        <span className={classes.result}>{homeTeamScore} - {awayTeamScore}</span>
    );
};

export default Result;
