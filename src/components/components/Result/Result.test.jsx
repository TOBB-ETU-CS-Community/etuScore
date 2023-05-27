import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Result from "./index";

describe('Result', () => {
    it('renders correctly the score values for both teams', () => {
        render(<Result homeTeamScore={2} awayTeamScore={1} />);
        expect(screen.getByText(/2/i)).toBeVisible()
        expect(screen.getByText(/-/i)).toBeVisible()
        expect(screen.getByText(/1/i)).toBeVisible()
    });
});
