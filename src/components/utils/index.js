/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const areAllGamesFinished = (startedGames) => startedGames.length === 0;
