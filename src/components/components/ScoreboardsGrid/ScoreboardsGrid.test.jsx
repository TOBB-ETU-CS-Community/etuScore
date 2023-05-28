import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ScoreboardsGrid from "./index"

describe('ScoreboardsGrid', () => {
    it('renders correctly all available scoreboards', async () => {
        render(<ScoreboardsGrid />)

        expect(await screen.findByText(/Games are about to start in 3 seconds./i)).toBeVisible()
        expect(await screen.findByText(/Games are about to start in 2 seconds./i)).toBeVisible()
        expect(await screen.findByText(/Games are about to start in 1 seconds./i)).toBeVisible()
        expect(await screen.findByText(/Argentina/i)).toBeVisible()
        expect(await screen.findByText(/Australia/i)).toBeVisible()
        expect(await screen.findByText(/Spain/i)).toBeVisible()
        expect(await screen.findByText(/Brazil/i)).toBeVisible()
    })
})
