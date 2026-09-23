export function lookUpPlayer(roster, player_id){
    let player = roster.find(player => player.player_id === player_id);
    return {full_name : player.full_name, team: player.team, position: player.position, jersey_number: player.jersey_number }
}

