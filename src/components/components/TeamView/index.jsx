import classes from "./team-view.module.scss";

const TeamView = ({teamData}) => {
    return (
        <div className={classes.team}>
            <img src={`https://img.myloview.de/fototapeten/volleyball-heart-infinity4-400-55795765.jpg`} width="80" height={50} alt={`${teamData.name}`}/>
            <span>{teamData.name}</span>
        </div>
    );
};

export default TeamView;
