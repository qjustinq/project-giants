export function lookUpTeam(teams, team_abbr){
    let team = teams.find(t => t.team_abbr === team_abbr);
    return team;
}