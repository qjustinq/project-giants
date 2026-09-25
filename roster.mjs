export let max_Length = 4

export function lookUpPlayer(roster, player_id){
    let player = roster.find(player => player.player_id === player_id);
    return {full_name : player.full_name, team: player.team, position: player.position, jersey_number: player.jersey_number }
}

export function shortenName(fullName, maxLength){
    let splitName = fullName.split(".")
    let new_name = splitName[0] + "." + splitName[1].slice(0, maxLength)
    return new_name
}

//console.log(shortenName("J.Tracy",max_Length))