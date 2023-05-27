import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MessageBoard from "./index";

describe('MessageBoard', () => {
    it('renders correctly messages', async () => {
        render(<MessageBoard message={'Current Games'}/>);

        expect(await screen.findByText(/CURRENT GAMES/i)).toBeVisible()
    });
});
