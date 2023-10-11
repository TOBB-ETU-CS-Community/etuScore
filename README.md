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

## Collection: users

| Field         | Type                   |
|---------------|------------------------|
| balance       | number (integer)       |
| bets          | array of strings       |
| isAdmin       | boolean                |
| isReferred    | boolean                |
| isVerified    | boolean                |
| userId        | string                 |
| username      | string                 |

## Collection: rooms

| Field          | Type                 |
|----------------|----------------------|
| roomId         | string               |
| startDate      | string               |
| availableTeam  | string               |
| betAmount      | number               |
| createdAt      | string (ISO 8601)    |
| creator        | string               |
| creatorName    | string               |
| creatorTeam    | string               |
| gameFinished   | boolean              |
| gameTime       | string               |
| matchId        | string               |
| name           | string               |
| participant    | string               |
| participantName| string               |

## Collection: groups

| Field      | Type                      |
|------------|---------------------------|
| createdAt  | string (formatted date)   |
| data       | number                    |
| grup1      | array of strings (size 6) |
| grup2      | array of strings (size 6) |
| grup3      | array of strings (size 6) |
| grup4      | array of strings (size 6) |
| grup5      | array of strings (size 6) |

## Collection: matches

| Field       | Type                |
|-------------|---------------------|
| data        | array of objects    |
| matchNumber | string              |
| date        | string              |
| time        | string              |
| group       | string              |
| team1       | string              |
| team2       | string              |
| result      | string              |



</div>
