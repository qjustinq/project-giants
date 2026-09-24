import plays from './test-plays.json' with {type: 'json'};

export const PIXELS_PER_YARD = 10;

export const Y_BAND = {left : 130, middle : 260, right: 390};

function yardsFromOwnEndZone(yardline100){
    return 100- yardline100
}

function getLocation(play){
    if (play.play_type === "pass"){
        return play.pass_location
    } else {
        return play.run_location
    }
}

export function xFromYards(yardsFromOwnGoal){
    return (10 + yardsFromOwnGoal) * PIXELS_PER_YARD
}

function yFromLocation(location){
    if (location === null || location === undefined){
        return Y_BAND.middle 
    }
    return Y_BAND[location]
}

function getLOS(play){
    return {x : xFromYards(yardsFromOwnEndZone(play.yardline_100)), y :  yFromLocation(getLocation(play)) }
}

function getCatchPoint(play){
    if (play.air_yards === null || play.air_yards === undefined){
        return null
    } else {
        return {x: xFromYards(yardsFromOwnEndZone(play.yardline_100) + play.air_yards) , y: yFromLocation(getLocation(play))  } 
    }
}

function getEndPoint(play){
    if (play.play_type === "pass" && play.complete_pass === 0 && getCatchPoint(play) != null){
        return getCatchPoint(play)
    }

    if (play.yards_gained === null || play.yards_gained === undefined){
        return null
    } else {
        return {x: xFromYards(yardsFromOwnEndZone(play.yardline_100) + play.yards_gained) ,
                y: yFromLocation(getLocation(play))
        }
    }   
}

export function playToCoordinates(play){
    return {LOS: getLOS(play), Catch: getCatchPoint(play), End: getEndPoint(play), Meta: {play_type : play.play_type, air_yards: play.air_yards, yards_gained : play.yards_gained , rusher_player_id : play.rusher_player_id , receiver_player_id : play.receiver_player_id, passer_player_id : play.passer_player_id } }
}

console.log(playToCoordinates(plays[4]))