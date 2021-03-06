// Description
//   ScoreKeeper module
//   Stores, retrieves, modifies, and deletes scoreboards for hubot.

module.exports = function(robot) {
    // private functions

    var getScoreboards = () => {
        return robot.brain.data.scoreboards || {};
    };

    var save = scoreboards => {
        robot.brain.data.scoreboards = scoreboards;
        robot.brain.emit('save', robot.brain.data);
    }

    // public functions

    this.createScoreboard = (scoreboardName, type, user) => {
        let scoreboards = getScoreboards();
        if (typeof scoreboards[scoreboardName] !== 'undefined') {
            return false;
        }
        scoreboards[scoreboardName] = {
            type: type,
            owner: user,
            players: {},
        };
        save(scoreboards);
        return Object.assign({}, scoreboards[scoreboardName]);
    };

    this.deleteScoreboard = (scoreboardName, user) => {
        const scoreboard = this.getScoreboard(scoreboardName);
        if (user != scoreboard.owner) {
            return false;
        }
        let scoreboards = getScoreboards();
        delete scoreboards[scoreboardName];
        save(scoreboards);
        return true;
    };

    this.getScoreboard = scoreboardName => {
        const scoreboards = getScoreboards();
        if (typeof scoreboards[scoreboardName] === 'undefined') {
            return null;
        }
        return Object.assign({}, scoreboards[scoreboardName]);
    };

    this.getAllScoreboards = () => {
        const scoreboards = getScoreboards();
        return Object.assign({}, scoreboards);
    };

    this.getOwner = scoreboardName => {
        const scoreboard = this.getScoreboard(scoreboardName);
        if (scoreboard === null) {
            return null;
        }
        return scoreboard.owner;
    };

    this.addPlayer = (scoreboardName, playerName) => {
        let scoreboards = getScoreboards();
        if (typeof scoreboards[scoreboardName] === null) {
            return false;
        } else if(typeof scoreboards[scoreboardName].players[playerName] !== 'undefined') {
            return false
        }
        scoreboards[scoreboardName].players[playerName] = {
            wins: 0,
            losses: 0,
            points: 0,
        };
        save(scoreboards);
        return true;
    };

    this.removePlayer = (scoreboardName, playerName) => {
        let scoreboards = getScoreboards();
        if (typeof scoreboards[scoreboardName] === null) {
            return false;
        }
        delete scoreboards[scoreboardName].players[playerName];
        save(scoreboards);
        return true;
    };

    this.adjustScores = (scoreboardName, playerName, wins = 0, losses = 0, points = 0) => {
        let scoreboards = getScoreboards();
        if (typeof scoreboards[scoreboardName] === 'undefined') {
            return false;
        }
        let player = scoreboards[scoreboardName].players[playerName];
        player.wins += wins;
        player.losses += losses;
        player.points += points;
        save(scoreboards);
        return Object.assign({}, scoreboards[scoreboardName]);
    };
};

