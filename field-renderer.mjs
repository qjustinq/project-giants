import { PIXELS_PER_YARD, Y_BAND, playToCoordinates, xFromYards } from "./coordinate-engine.mjs";
import { max_Length,lookUpPlayer, shortenName } from "./roster.mjs";
import fs from 'fs';

import plays from './test-plays.json' with {type: 'json'};
import roster from './roster.json' with {type: 'json'}

function buildExampleSVG(playCoords){
    const totalWidth = 120 * PIXELS_PER_YARD
    const endZoneWidth = 10 * PIXELS_PER_YARD
    const rightEndZoneX = totalWidth - endZoneWidth
    const HASH_TOP = 170;
    const HASH_BOTTOM = 360;    
    const height = 520;
    const spacing = 25;
    const isIncompletePass = playCoords.Catch && playCoords.Meta.complete_pass === 0 && playCoords.Meta.interception === 0;
    const isInterception = playCoords.Catch && playCoords.Meta.interception === 1;
    const receiverOffset = 10;
    const receiverX = isInterception ? playCoords.Catch.x + receiverOffset : playCoords.End.x;

    const isFumble = playCoords.Meta.fumble === 1;
    const isFumbleLost = playCoords.Meta.fumble_lost === 1;

    const isSack = playCoords.Meta.sack === 1;
    const passerX = isSack ? playCoords.End.x : playCoords.LOS.x;
    const passerY = isSack ? playCoords.End.y : playCoords.LOS.y;
    const sackOffset = 10;
    const sackDefender = isSack || isFumbleLost
        ? `<circle cx = "${playCoords.End.x + sackOffset}" cy = "${playCoords.End.y}" r = "8" fill = "pink" />`
        : '';
    
    const tdX = rightEndZoneX + (endZoneWidth/2);
    const tdY = height/2;
    const isTouchdown = playCoords.Meta.touchdown === 1 && !isInterception;
    const touchdownText = isTouchdown
        ? `<text x="${tdX}" y="${tdY}" fill="white" stroke="black" stroke-width="2.5" paint-order="stroke" font-size = "40" text-anchor="middle" dominant-baseline="middle" transform="rotate(90, ${tdX}, ${tdY})"> TOUCHDOWN </text>`
        : '';

    let allLines = '';
    let allYardText = '';
    for (let i = 0; i <= 100; i+= 10){
        let label = (i <= 50) ? i : 100 - i;
        allLines += `<line x1 = "${xFromYards(i)}" y1 = "0" x2 = "${xFromYards(i)}" y2 = "${height}" stroke="white" stroke-width="2" />`;
        allYardText += (label === 0) ? '' :`<text x="${xFromYards(i)}" y="30" fill="white" font-size="14"> ${label} </text> <text x="${xFromYards(i)}" y="${height - 30}" fill="white" font-size="14"> ${label} </text> `   
    }

    let hashLines = '';
    for (let i = 0; i <= 100; i += 1){
        hashLines += `<line x1 = "${xFromYards(i)}" y1 = "${HASH_TOP - 5}" x2 = "${xFromYards(i)}" y2 = "${HASH_TOP + 5}" stroke="white" stroke-width="2" stroke-opacity =".6" /> <line x1 = "${xFromYards(i)}" y1 = "${HASH_BOTTOM - 5}" x2 = "${xFromYards(i)}" y2 = "${HASH_BOTTOM + 5}" stroke="white" stroke-width="2" stroke-opacity ="0.6" />`;
    }

    let singleYardLines = ''
    for (let i = 0; i <= 100; i += 1){
        singleYardLines += `<line x1 = "${xFromYards(i)}" y1 = "${0}" x2 = "${xFromYards(i)}" y2 = "${10}" stroke="white" stroke-width="2" stroke-opacity ="0.6" /> <line x1 = "${xFromYards(i)}" y1 = "${height}" x2 = "${xFromYards(i)}" y2 = "${height - 10}" stroke="white" stroke-width="2" stroke-opacity ="0.6"  />`;
    }

    let rusherInfo = null
    let rusherNameTextEnd = ''
    let rusherNumberTextEnd = ''
    if (playCoords.Meta.rusher_player_id){
        rusherInfo = lookUpPlayer(roster, playCoords.Meta.rusher_player_id)

        rusherNumberTextEnd = `<text x="${playCoords.End.x}" y="${playCoords.End.y + 4}" text-anchor = "middle" fill="white" font-size="14" stroke="black" stroke-width="2.5" paint-order="stroke"> ${rusherInfo.jersey_number}  </text>`;
        rusherNameTextEnd = `<text x="${playCoords.End.x}" y="${playCoords.End.y - 15}" text-anchor = "middle" fill="white" font-size="14" stroke="black" stroke-width="2.5" paint-order="stroke"> ${shortenName(rusherInfo.full_name,max_Length)}  </text>`;
        
        
    }

    let receiverInfo = null
    let receiverNameTextEnd = ''
    let receiverNumberTextEnd = ''
    if (playCoords.Meta.receiver_player_id){
        receiverInfo = lookUpPlayer(roster, playCoords.Meta.receiver_player_id)

        receiverNumberTextEnd = `<text x="${receiverX}" y="${playCoords.End.y + 4}" text-anchor = "middle" fill="white" font-size="14" stroke="black" stroke-width="2.5" paint-order="stroke"> ${receiverInfo.jersey_number}  </text>`;
        receiverNameTextEnd = `<text x="${receiverX}" y="${playCoords.End.y - 15}" text-anchor = "middle" fill="white" font-size="14" stroke="black" stroke-width="2.5" paint-order="stroke"> ${shortenName(receiverInfo.full_name, max_Length)}  </text>`;

        
    }

    let passerInfo = null
    let passerNameTextEnd = ''
    let passerNumberTextEnd = ''
    if (playCoords.Meta.passer_player_id){
        passerInfo = lookUpPlayer(roster, playCoords.Meta.passer_player_id)

        passerNumberTextEnd = `<text x="${passerX}" y="${passerY + 4}" text-anchor = "middle" fill="white" font-size="14" stroke="black" stroke-width="2.5" paint-order="stroke"> ${passerInfo.jersey_number}  </text>`;
        passerNameTextEnd = `<text x="${passerX}" y="${passerY - 15}" text-anchor = "middle" fill="white" font-size="14" stroke="black" stroke-width="2.5" paint-order="stroke">  ${shortenName(passerInfo.full_name, max_Length)}  </text>`;

        
    }

    let oLine = ''
    for (let i = 0; i <= 4; i++){
        let offset = (i-2) * spacing;
        let smallOffset = 25;
        oLine += `<circle cx = "${playCoords.LOS.x + smallOffset}" cy = "${playCoords.LOS.y + offset}" r = "8" fill = "red" />`

    }

    let oLineEnemy = ''
    for (let i = 0; i <= 4; i++){
        let offset = (i-2) * spacing;
        let bigOffset = 45;
        oLineEnemy += `<circle cx = "${playCoords.LOS.x + bigOffset}" cy = "${playCoords.LOS.y + offset}" r = "8" fill = "red" />`

    }

    const arrowMarker = 
        `<defs>
           <marker id="arrowhead" markerWidth="5" markerHeight="10" refX="5" refY="5" orient="auto">
             <polygon points="0 0, 10 5, 0 10" fill="white" />
          </marker>
        </defs>`

    let catchCircle = '';
    if (playCoords.Catch){
        if (isInterception){
           catchCircle += `<circle cx = "${playCoords.Catch.x}" cy = "${playCoords.Catch.y}" r = "8" fill= "pink" />`;
           catchCircle += `<circle cx = "${receiverX}" cy = "${playCoords.Catch.y}" r = "8" fill= "red" />`;
        } else if (isIncompletePass){
            catchCircle = `<circle cx = "${playCoords.Catch.x}" cy = "${playCoords.Catch.y}" r = "8" fill="none" stroke="red" stroke-width="2" />`;
        } else {
           catchCircle = `<circle cx = "${playCoords.Catch.x}" cy = "${playCoords.Catch.y}" r = "8" fill = "blue" />`
        }
    }
    
    let fumbleText = '';
    if (isFumbleLost){
        fumbleText = `<text x="${playCoords.End.x}" y="${playCoords.End.y - 32}" text-anchor = "middle" fill="white" font-size="14" stroke="black" stroke-width="2.5" paint-order="stroke">  Fumble Lost!  </text>`;
    } else if (isFumble) {
        fumbleText = `<text x="${playCoords.End.x}" y="${playCoords.End.y - 32}" text-anchor = "middle" fill="white" font-size="14" stroke="black" stroke-width="2.5" paint-order="stroke">  Fumble Recovered!  </text>`;
    }

    const pathLines = playCoords.Catch
        ? `<line x1 = "${playCoords.LOS.x}" y1 = "${playCoords.LOS.y}" x2 = "${playCoords.Catch.x}" y2 = "${playCoords.Catch.y}" stroke = "white" stroke-width = "2" />`
        : `<line x1 ="${playCoords.LOS.x}" y1="${playCoords.LOS.y}" x2="${playCoords.End.x}" y2="${playCoords.End.y}" stroke="white" stroke-width="2" marker-end="url(#arrowhead)" />`;

    
    const secondSegment = (playCoords.Catch && !isIncompletePass && !isInterception)
        ? `<line x1 ="${playCoords.Catch.x}" y1="${playCoords.Catch.y}" x2="${playCoords.End.x}" y2="${playCoords.End.y}" stroke="white" stroke-width="2" marker-end="url(#arrowhead)" />`
        : '';

    const endCircle = (isIncompletePass || isInterception)
        ? ''
        : `<circle cx = "${playCoords.End.x}" cy = "${playCoords.End.y}" r = "8" fill = "red" />`;

    return `<svg width = "${totalWidth}" height = "${height}">
            <rect x = "0" y = "0" width = "${totalWidth}" height = "${height}" fill = "green" /> 
            <rect x = "0" y = "0" width = "${endZoneWidth}" height = "${height}" fill = "blue" />
            <rect x = "${rightEndZoneX}" y = "0" width = "${endZoneWidth}" height = "${height}" fill = "blue" /> 
            ${allLines}
            ${allYardText}
            ${hashLines}
            ${singleYardLines}
            ${pathLines}
            ${secondSegment}
            ${catchCircle}
            ${oLine}
            ${oLineEnemy}
            <circle cx = "${playCoords.LOS.x}" cy = "${playCoords.LOS.y}" r = "8" fill = "red" />
            ${endCircle}
            ${sackDefender}
            ${rusherNameTextEnd}
            ${rusherNumberTextEnd}
            ${receiverNameTextEnd}
            ${receiverNumberTextEnd}
            ${passerNameTextEnd}
            ${passerNumberTextEnd}
            ${arrowMarker}
            ${touchdownText}
            ${fumbleText}
            

            
    </svg>`;  
}

let allPlays = '';
for (let i = 0; i < plays.length; i++){
    allPlays += `<h3>${plays[i]._description}</h3>`
    allPlays += buildExampleSVG(playToCoordinates(plays[i]));
}
//const svgContent = buildExampleSVG(playToCoordinates(plays[6]));
const fullPage = `<html><body>${allPlays}</body></html>`;

fs.writeFileSync('example.html', fullPage);

