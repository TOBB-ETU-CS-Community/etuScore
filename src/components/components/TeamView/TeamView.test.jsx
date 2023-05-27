import { getByAltText, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TeamView from "./index";

describe('TeamView', () => {
    it('renders correctly the team view, showing team name and flag', async () => {
        const { getByAltText } = await render(
            <TeamView teamData={
                {
                    countryCode: 'es',
                    name: 'Spain'
                }
            } />
        );

        expect(screen.getByText(/Spain/i)).toBeVisible()
        const flag = getByAltText('Spain');
        expect(flag).toHaveAttribute('src', 'https://flagcdn.com/es.svg')
    });
});
