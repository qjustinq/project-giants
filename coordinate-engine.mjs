const PIXELS_PER_YARD = 10;
const Y_BAND = {left : 130, middle : 260, right: 390};
const play = {yardline_100 : 48 , pass_location : "right" }

function yardsFromOwnEndZone(yardline100){
    return 100- yardline100
}

function xFromYards(yardsFromOwnGoal){
    return (10 + yardsFromOwnGoal) * PIXELS_PER_YARD
}

function yFromLocation(location, str){
    return Y_BAND[location]
}

function getLOS(play){
    return {x : xFromYards(yardsFromOwnEndZone(play.yardline_100)), y :  yFromLocation(play.pass_location) }
}

let test = getLOS(play)
console.log(test);

