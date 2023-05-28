import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import GameStatus from "./index";

describe('GameStatus', () => {
    it('renders correctly the status of a game', async () => {
        render(<GameStatus status={'Started'}/>);
        expect(screen.getByText(/Started/i)).toBeVisible()
    });
});
