import { PIXELS_PER_YARD, Y_BAND, playToCoordinates, xFromYards } from "./coordinate-engine.mjs";
import { lookUpPlayer } from "./roster.mjs";
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
        rusherInfo = rusherInfo = lookUpPlayer(roster, playCoords.Meta.rusher_player_id)

        rusherNumberTextEnd = `<text x="${playCoords.End.x}" y="${playCoords.End.y + 4}" text-anchor = "middle" fill="white" font-size="14"> ${rusherInfo.jersey_number}  </text>`;
        rusherNameTextEnd = `<text x="${playCoords.End.x}" y="${playCoords.End.y - 15}" text-anchor = "middle" fill="white" font-size="14"> ${rusherInfo.full_name}  </text>`;
        
        
    }

    const catchCircle = playCoords.Catch
        ? `<circle cx = "${playCoords.Catch.x}" cy = "${playCoords.Catch.y}" r = "8" fill = "yellow" />`
        : '';

    const pathLines = playCoords.Catch
        ? `<line x1 = "${playCoords.LOS.x}" y1 = "${playCoords.LOS.y}" x2 = "${playCoords.Catch.x}" y2 = "${playCoords.Catch.y}" stroke = "white" stroke-width = "2" />
           <line x1 ="${playCoords.Catch.x}" y1="${playCoords.Catch.y}" x2="${playCoords.End.x}" y2="${playCoords.End.y}" stroke="white" stroke-width="2" />`
        : `<line x1 ="${playCoords.LOS.x}" y1="${playCoords.LOS.y}" x2="${playCoords.End.x}" y2="${playCoords.End.y}" stroke="white" stroke-width="2" />`;


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
            <circle cx = "${playCoords.LOS.x}" cy = "${playCoords.LOS.y}" r = "8" fill = "red" />
            <circle cx = "${playCoords.End.x}" cy = "${playCoords.End.y}" r = "8" fill = "red" />
            ${rusherNameTextEnd}
            ${rusherNumberTextEnd}
            

            
    </svg>`;  
}

const svgContent = buildExampleSVG(playToCoordinates(plays[1]));
const fullPage = `<html><body>${svgContent}</body></html>`;

fs.writeFileSync('example.html', fullPage);

