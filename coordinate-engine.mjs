import plays from './test-plays.json' with {type: 'json'};

const PIXELS_PER_YARD = 10;
const Y_BAND = {left : 130, middle : 260, right: 390};
const play = {play_type: "run", yardline_100 : 72 , run_location : "left", pass_location : null, air_yards : null , yards_gained: 15}
const play1 = {play_type: "pass", yardline_100 : 34 , run_location : "null", pass_location : "right", air_yards : 24 , yards_gained: 25}

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

function xFromYards(yardsFromOwnGoal){
    return (10 + yardsFromOwnGoal) * PIXELS_PER_YARD
}

function yFromLocation(location){
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
    if (play.yards_gained === null || play.yards_gained === undefined){
        return null
    } else {
        return {x: xFromYards(yardsFromOwnEndZone(play.yardline_100) + play.yards_gained) ,
                y: yFromLocation(getLocation(play))
        }
    }   
}

function playToCoordinates(play){
    return {LOS: getLOS(play), Catch: getCatchPoint(play), End: getEndPoint(play), Meta: {play_type : play.play_type, air_yards: play.air_yards, yards_gained : play.yards_gained} }
}

for (let i = 0; i < plays.length; i++){
    console.log(playToCoordinates(plays[i]))
}