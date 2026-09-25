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

        rusherNumberTextEnd = `<text x="${playCoords.End.x}" y="${playCoords.End.y + 4}" text-anchor = "middle" fill="white" font-size="14"> ${rusherInfo.jersey_number}  </text>`;
        rusherNameTextEnd = `<text x="${playCoords.End.x}" y="${playCoords.End.y - 15}" text-anchor = "middle" fill="white" font-size="14"> ${shortenName(rusherInfo.full_name,max_Length)}  </text>`;
        
        
    }

    let receiverInfo = null
    let receiverNameTextEnd = ''
    let receiverNumberTextEnd = ''
    if (playCoords.Meta.receiver_player_id){
        receiverInfo = lookUpPlayer(roster, playCoords.Meta.receiver_player_id)

        receiverNumberTextEnd = `<text x="${playCoords.End.x}" y="${playCoords.End.y + 4}" text-anchor = "middle" fill="white" font-size="14"> ${receiverInfo.jersey_number}  </text>`;
        receiverNameTextEnd = `<text x="${playCoords.End.x}" y="${playCoords.End.y - 15}" text-anchor = "middle" fill="white" font-size="14"> ${shortenName(receiverInfo.full_name, max_Length)}  </text>`;

        
    }

    let passerInfo = null
    let passerNameTextEnd = ''
    let passerNumberTextEnd = ''
    if (playCoords.Meta.passer_player_id){
        passerInfo = lookUpPlayer(roster, playCoords.Meta.passer_player_id)

        passerNumberTextEnd = `<text x="${playCoords.LOS.x}" y="${playCoords.LOS.y + 4}" text-anchor = "middle" fill="white" font-size="14"> ${passerInfo.jersey_number}  </text>`;
        passerNameTextEnd = `<text x="${playCoords.LOS.x}" y="${playCoords.LOS.y - 15}" text-anchor = "middle" fill="white" font-size="14"> ${shortenName(passerInfo.full_name, max_Length)}  </text>`;

        
    }

    let oLine = ''
    for (let i = 0; i <= 4; i++){
        let offset = (i-2) * spacing;
        let smallOffset = 25;
        oLine += `<circle cx = "${playCoords.LOS.x + smallOffset}" cy = "${playCoords.LOS.y + offset}" r = "8" fill = "red" />`

    }

    const arrowMarker = 
        `<defs>
           <marker id="arrowhead" markerWidth="5" markerHeight="10" refX="5" refY="5" orient="auto">
             <polygon points="0 0, 10 5, 0 10" fill="white" />
          </marker>
        </defs>`


    const catchCircle = playCoords.Catch
        ? `<circle cx = "${playCoords.Catch.x}" cy = "${playCoords.Catch.y}" r = "8" fill = "yellow" />`
        : '';

    const pathLines = playCoords.Catch
        ? `<line x1 = "${playCoords.LOS.x}" y1 = "${playCoords.LOS.y}" x2 = "${playCoords.Catch.x}" y2 = "${playCoords.Catch.y}" stroke = "white" stroke-width = "2" />
           <line x1 ="${playCoords.Catch.x}" y1="${playCoords.Catch.y}" x2="${playCoords.End.x}" y2="${playCoords.End.y}" stroke="white" stroke-width="2" marker-end="url(#arrowhead)" />`
        : `<line x1 ="${playCoords.LOS.x}" y1="${playCoords.LOS.y}" x2="${playCoords.End.x}" y2="${playCoords.End.y}" stroke="white" stroke-width="2" marker-end="url(#arrowhead)" />`;


    return `<svg width = "${totalWidth}" height = "${height}">
            <rect x = "0" y = "0" width = "${totalWidth}" height = "${height}" fill = "green" /> 
            <rect x = "0" y = "0" width = "${endZoneWidth}" height = "${height}" fill = "blue" />
            <rect x = "${rightEndZoneX}" y = "0" width = "${endZoneWidth}" height = "${height}" fill = "blue" /> 
            ${pathLines}
            ${catchCircle}
            ${allLines}
            ${allYardText}
            ${hashLines}
            ${singleYardLines}
            ${oLine}
            <circle cx = "${playCoords.LOS.x}" cy = "${playCoords.LOS.y}" r = "8" fill = "red" />
            <circle cx = "${playCoords.End.x}" cy = "${playCoords.End.y}" r = "8" fill = "red" />
            ${rusherNameTextEnd}
            ${rusherNumberTextEnd}
            ${receiverNameTextEnd}
            ${receiverNumberTextEnd}
            ${passerNameTextEnd}
            ${passerNumberTextEnd}
            ${arrowMarker}
            

            
    </svg>`;  
}

const svgContent = buildExampleSVG(playToCoordinates(plays[2]));
const fullPage = `<html><body>${svgContent}</body></html>`;

fs.writeFileSync('example.html', fullPage);

