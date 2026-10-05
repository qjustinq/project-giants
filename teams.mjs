export function lookUpTeam(teams, team_abbr){
    let team = teams.find(t => t.team_abbr === team_abbr);
    return team;
}

export function colorDistance(color1,color2){
    const red1 = parseInt(color1.slice(1, 3), 16);
    const green1 = parseInt(color1.slice(3, 5), 16);
    const blue1 = parseInt(color1.slice(5, 7), 16);

    const red2 = parseInt(color2.slice(1, 3), 16);
    const green2 = parseInt(color2.slice(3, 5), 16);
    const blue2 = parseInt(color2.slice(5, 7), 16);

    const dr = red1-red2;
    const dg = green1-green2;
    const db = blue1-blue2;

    return Math.sqrt(dr*dr + dg*dg + db*db)

}

console.log(colorDistance("#16285A", "#0E3862"))