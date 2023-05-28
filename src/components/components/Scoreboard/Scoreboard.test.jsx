import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Scoreboard from "./index";

describe('Scoreboard', () => {
    it('renders correctly', () => {
        render(<Scoreboard pairScore={
            {
                gameId: 5,
                startedGame: false,
                homeTeam: {
                    name: 'Argentina',
                    countryCode: 'ar',
                    score: 0
                },
                awayTeam: {
                    name: 'Australia',
                    countryCode: 'au',
                    score: 0
                }
            }
        } />);
    expect(screen.getByText(/Argentina/i)).toBeVisible()
    expect(screen.getByText(/Australia/i)).toBeVisible()
    });
});
