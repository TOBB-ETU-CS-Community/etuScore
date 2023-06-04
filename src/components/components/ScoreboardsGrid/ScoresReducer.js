import SheetsService from "../../../services/sheets.service";
import {fetchMatchesFireStore} from "../../../services/firebase";
const teamsMap = {
  1: "homeTeam",
  2: "awayTeam",
};

const sortGamesByTotalScore = (currentGame, nextGame) => {
  const currentGameTotalScore =
    currentGame.homeTeam.score + currentGame.awayTeam.score;
  const nextGameTotalScore = nextGame.homeTeam.score + nextGame.awayTeam.score;
  return nextGameTotalScore - currentGameTotalScore;
};

export const actionTypes = {
  START_GAME: "start",
  UPDATE_SCORE: "update",
  FINISH_GAME: "finish",
  FETCH_GAMES: "fetch", // Add FETCH_GAMES action type
};

export const initialState = {
  finishedGames: [],
  games: [],
};

const reducer = (state, action) => {
  const data = action.data;
  const { gameId } = data;

  switch (action.type) {
    case actionTypes.START_GAME:
      return {
        ...state,
        games: state.games.map((game) =>
          game.gameId === gameId ? { ...game, startedGame: true } : game
        ),
      };
    case actionTypes.UPDATE_SCORE:
      const { teamId } = data;

      // Don't update the score if the game has not started yet
      const isGameStarted = state.games.find(
        (game) => game.gameId === gameId && game.startedGame === true
      );
      if (!isGameStarted) {
        return state;
      }

      // Increment the goals value of the team who scored
      const team = teamsMap[teamId];
      return {
        ...state,
        games: state.games.map((game) =>
          game.gameId === gameId
            ? {
                ...game,
                [team]: {
                  ...game[team],
                  score: game[team].score + 1,
                },
              }
            : game
        ),
      };
    case actionTypes.FINISH_GAME:
      return {
        ...state,
        games: state.games.filter((game) => game.gameId !== gameId),
        finishedGames: [
          ...state.finishedGames,
          state.games.find((game) => game.gameId === gameId),
        ]
          .filter(Boolean) // filter(Boolean) keeps the array clean, i.e. removes `undefined` or `null`
          .sort(sortGamesByTotalScore)
          .map((game) => {
            game.startedGame = false;
            return game;
          }),
      };
    case actionTypes.FETCH_GAMES: // Handle FETCH_GAMES action type
      return {
        ...state,
        games: data.games,
      };
    default:
      throw new Error("Unrecognized action type. Please check ScoresReducer.");
  }
};

export const fetchMatches = async () => {
  try {
    const response = await fetchMatchesFireStore();
    const matches = response.data;
    const games = matches.map((match, index) => {
      if (Object.keys(match).length < 7) {
        return {
          gameId: match.matchNumber, // Event ID
          startedGame: false,
          eventDate: match.date, // Event Date
          homeTeam: {
            name: match.team1, // Event Name
            countryCode: "ca",
            score:0, // Parse the home score as an integer
          },
          awayTeam: {
            name: match.team2, // Event Description
            countryCode: "mx",
            score: 0, // Parse the away score as an integer
          },
          gameTime: match.time,
        };
      }
      const score = match.result; // Event Result
      const [homeScore, awayScore] = score.split("-");
      return {
        gameId: match.matchNumber, // Event ID
        startedGame: false,
        eventDate: match.date, // Event Date
        homeTeam: {
          name: match.team1, // Event Name
          countryCode: "ca",
          score: parseInt(homeScore), // Parse the home score as an integer
        },
        awayTeam: {
          name: match.team2, // Event Description
          countryCode: "mx",
          score: parseInt(awayScore), // Parse the away score as an integer
        },
      };
    });
    return {
      games,
    };
  } catch (error) {
    console.error("Error fetching matches:", error);
    return initialState;
  }
};

export default reducer;
