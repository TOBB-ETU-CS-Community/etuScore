<div align="center">
 
# EtuSkor

<p>This project aims to make volleyball matches even more exciting by introducing a betting system for our university. It offers a free and fun experience for registered students who can participate by predicting match results. Registered users earn coffee beans, and they can earn extra beans by referring others. The betting system requires at least two users to join a match for a bet to be valid. The winning user receives the entire accumulated balance on the table.</p>

 <h2>Team Members</h2>
<ul>
  <li> <a href="https://github.com/berykay">Berkay YILDIZ</a></li>
  <li> <a href="https://github.com/hpekkan">Hüseyin PEKKAN</a></li>
 
</ul>
<h2>Features</h2>
<ul>
  <li>Registration with "@etu.edu.tr" email address</li>
  <li>Earning coffee beans for registered students</li>
  <li>Referral system to earn extra coffee beans</li>
  <li>Placing bets on matches</li>
  <li>Minimum two users required for a valid bet</li>
  <li>Winner receives the accumulated balance</li>
  <li>Leaderboard with rewards for top three individuals</li>
</ul>

# Web App Showcase


<h2>Match Calendar</h2>

https://github.com/hpekkan/etuScore/assets/75019129/e4bac561-11ab-41eb-8571-690e950f8178

## <p align="center"> If above video is broken <a hef="https://youtu.be/8f1vHFwHP60"> https://youtu.be/8f1vHFwHP60</a> </p>

<h2>Match Page</h2>

![image1](https://github.com/hpekkan/etuScore/assets/75019129/f28eaa17-d2ab-4952-a626-94ad3fce75de)


<h2>LeaderBoard</h2>

![image4](https://github.com/hpekkan/etuScore/assets/75019129/ca7e8577-7e06-4872-8ef0-cc09fba24e56)

<h2>Groups</h2>

![image3](https://github.com/hpekkan/etuScore/assets/75019129/9ce16494-1db5-4fd2-a1c4-e7b17728d316)

<h2>Profile Page</h2>

![image2](https://github.com/hpekkan/etuScore/assets/75019129/1d6dd389-303c-4046-82ce-0b6603e50c31)

<h2>Firebase</h2>

![image0](https://github.com/hpekkan/etuScore/assets/75019129/67ab92c9-388d-4695-b0d8-820248668baa)



<h2>Getting Started</h2>
<p>To get started with this project:</p>
<ol>
  <li>Clone the repository: <code>git clone https://github.com/TOBB-ETU-CS-Community/etuScore.git</code></li>
  <li>Install the dependencies: <code>npm install</code></li>
  <li>Configure the Firebase credentials in the project</li>
  <li>Run the development server: <code>npm start</code></li>
</ol>
  
# Contributing

<p>We welcome contributions from everyone! If you would like to contribute to this project, please follow these steps:</p>
<ol>
  <li>Fork the repository and clone it to your local machine.</li>
  <li>Create a new branch for your feature or bug fix: <code>git checkout -b my-new-feature</code>.</li>
  <li>Make your changes and test thoroughly.</li>
  <li>Commit your changes: <code>git commit -am 'Add some feature'</code>.</li>
  <li>Push to the branch: <code>git push origin my-new-feature</code>.</li>
  <li>Open a pull request (PR) on GitHub and provide a clear description of your changes.</li>
</ol>

<h2>Issues</h2>

<p>If you encounter any bugs, issues, or have any suggestions, please open an issue on the GitHub repository. We appreciate detailed bug reports, including steps to reproduce the issue.</p>

<h2>Security</h2>

<p>We take security seriously. If you discover any security vulnerabilities or breaches, please reach out to Hüseyin Pekkan at <a href="mailto:hpekkan@etu.edu.tr">hpekkan@etu.edu.tr</a> or Berkay Yıldız at <a href="mailto:Berkay.yildiz@etu.edu.tr">Berkay.yildiz@etu.edu.tr</a>. Please avoid disclosing the vulnerability publicly until we have had a chance to address it.</p>

# Firebase Structure
<h2>Collection: users</h2>

<p>Fields:</p>
<ul>
  <li><code>balance</code>: number (integer)</li>
  <li><code>bets</code>: array of strings (room_ids)</li>
  <li><code>isAdmin</code>: boolean</li>
  <li><code>isReferred</code>: boolean</li>
  <li><code>isVerified</code>: boolean</li>
  <li><code>userId</code>: string</li>
  <li><code>username</code>: string</li>
</ul>

<h2>Collection: rooms</h2>

<p>Fields:</p>
<ul>
  <li><code>roomId</code>: string</li>
  <li><code>startDate</code>: string (in the format "dd.mm.yy")</li>
  <li><code>availableTeam</code>: string</li>
  <li><code>betAmount</code>: number</li>
  <li><code>createdAt</code>: string (in ISO 8601 format)</li>
  <li><code>creator</code>: string</li>
  <li><code>creatorName</code>: string</li>
  <li><code>creatorTeam</code>: string</li>
  <li><code>gameFinished</code>: boolean</li>
  <li><code>gameTime</code>: string (in the format "hh.mm")</li>
  <li><code>matchId</code>: string</li>
  <li><code>name</code>: string</li>
  <li><code>participant</code>: string</li>
  <li><code>participantName</code>: string</li>
</ul>

<h2>Collection: groups</h2>

<p>Fields:</p>
<ul>
  <li><code>createdAt</code>: string (in the format "MMMM DD, YYYY at hh:mm:ss A Z")</li>
  <li><code>data</code>: number</li>
  <li><code>grup1</code>: array of strings (size 6)</li>
  <li><code>grup2</code>: array of strings (size 6)</li>
  <li><code>grup3</code>: array of strings (size 6)</li>
  <li><code>grup4</code>: array of strings (size 6)</li>
  <li><code>grup5</code>: array of strings (size 6)</li>
</ul>

<h2>Collection: matches</h2>

<p>Fields:</p>
<ul>
  <li><code>data</code>: array of objects</li>
  <ul>
    <li><code>matchNumber</code>: string</li>
    <li><code>date</code>: string (in the format "DD.MM.YY")</li>
    <li><code>time</code>: string (in the format "hh.mm")</li>
    <li><code>group</code>: string</li>
    <li><code>team1</code>: string</li>
    <li><code>team2</code>: string</li>
    <li><code>result</code>: string (in the format "X-Y" or "X-Y(h)", where X and Y are integers representing the number of goals scored by each team)</li>
  </ul>
</ul>


</div>
