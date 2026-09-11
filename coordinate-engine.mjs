const PIXELS_PER_YARD = 10;

function yardsFromOwnEndZone(yardline100){
    return 100- yardline100
}

function xFromYards(yardsFromOwnGoal){

    return (10 + yardsFromOwnGoal) * PIXELS_PER_YARD
}

let test = xFromYards(52)
console.log(test);

