const PIXELS_PER_YARD = 10;
const Y_BAND = {left : 130, middle : 260, right: 390};
const play = {yardline_100 : 48 , pass_location : "right", air_yards : -4 , yards_gained: 4}

function yardsFromOwnEndZone(yardline100){
    return 100- yardline100
}

function xFromYards(yardsFromOwnGoal){
    return (10 + yardsFromOwnGoal) * PIXELS_PER_YARD
}

function yFromLocation(location){
    return Y_BAND[location]
}

function getLOS(play){
    return {x : xFromYards(yardsFromOwnEndZone(play.yardline_100)), y :  yFromLocation(play.pass_location) }
}

function getCatchPoint(play){
    if (play.air_yards == null || undefined){
        return null
    } else {
        return {x: xFromYards(yardsFromOwnEndZone(play.yardline_100) + play.air_yards) , y: yFromLocation(play.pass_location)  } 
    }
}

function getEndPoint(play){
    if (play.yards_gained == null || undefined){
        return null
    } else {
        return {x: xFromYards(yardsFromOwnEndZone(play.yardline_100) + play.yards_gained) ,
                y: yFromLocation(play.pass_location)
        }
    }
}
    
let test = getEndPoint(play)
console.log(test);

