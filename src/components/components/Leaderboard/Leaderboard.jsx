import React, { useEffect, useState } from 'react'
import { leaderBoard } from '../../../services/firebase'

export default function Leaderboard() {
    console.log(leaderBoard())
    const [leads, setLeads] = useState([])
    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data } = await leaderBoard()
            console.log(data)
        }
        fetchLeaderboard()
    }, [])
  return (
    <div>Leaderboard</div>
  )
}
