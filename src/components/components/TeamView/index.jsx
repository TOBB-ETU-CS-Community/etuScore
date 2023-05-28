import classes from "./team-view.module.scss";

const TeamView = ({teamData}) => {
    return (
        <div className={classes.team}>
            <img src={`https://flagcdn.com/${teamData.countryCode}.svg`} width="50" alt={`${teamData.name}`}/>
            <span>{teamData.name}</span>
        </div>
    );
};

export default TeamView;
