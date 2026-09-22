import { PIXELS_PER_YARD, Y_BAND, playToCoordinates, xFromYards } from "./coordinate-engine.mjs";
import fs from 'fs';

import plays from './test-plays.json' with {type: 'json'};


function buildExampleSVG(playCoords){
    const totalWidth = 120 * PIXELS_PER_YARD
    const endZoneWidth = 10 * PIXELS_PER_YARD
    const rightEndZoneX = totalWidth - endZoneWidth
     const height = 520;
    
    let allLines = '';
    let allYardText = '';
    for (let i = 0; i <= 100; i+= 10){
        let label = (i <= 50) ? i : 100 - i;
        allLines += `<line x1 = "${xFromYards(i)}" y1 = "0" x2 = "${xFromYards(i)}" y2 = "${height}" stroke="white" stroke-width="2" />`;
        allYardText += (label === 0) ? '' :`<text x="${xFromYards(i)}" y="30" fill="white" font-size="14"> ${label} </text>`   
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
            <circle cx = "${playCoords.LOS.x}" cy = "${playCoords.LOS.y}" r = "8" fill = "red" />
            <circle cx = "${playCoords.End.x}" cy = "${playCoords.End.y}" r = "8" fill = "red" />
            

            
    </svg>`;  
}

const svgContent = buildExampleSVG(playToCoordinates(plays[0]));
const fullPage = `<html><body>${svgContent}</body></html>`;

fs.writeFileSync('example.html', fullPage);

