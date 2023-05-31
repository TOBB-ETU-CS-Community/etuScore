import React, { useEffect, useState } from 'react'
import { leaderBoard } from '../../../services/firebase'

export default function Leaderboard() {
    let data;
    const [leads, setLeads] = useState([])
    useEffect(() => {
      const fetchLeaderboard = async () => {
        try {
          const data = await leaderBoard();
          setLeads(data);
        } catch (error) {
          console.error(error);
        }
      };
    
      fetchLeaderboard();
    }, []);
  return (
    <div>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{lead.username}</td>
              <td>{lead.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
