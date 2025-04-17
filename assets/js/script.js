var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};
function loadFileData(filename) {
    if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
        try {
            var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];

            // Convert sheet to JSON to filter blank rows
            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
            // Filter out blank rows (rows where all cells are empty, null, or undefined)
            var filteredData = jsonData.filter(row =>
                row.some(cell => cell !== '' && cell !== null && cell !== undefined)
            );

            // Convert filtered JSON back to CSV
            var csv = XLSX.utils.aoa_to_sheet(filteredData); // Create a new sheet from filtered array of arrays
            csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
            return csv;
        } catch (e) {
            console.error(e);
            return "";
        }
    }
    return gk_fileData[filename] || "";
}

document.addEventListener('DOMContentLoaded', () => {
    const bingoCells = document.querySelectorAll('.xblog-bingo-card td:not(.free-space)');

    // Function to toggle the 'marked' class
    const toggleMark = (cell, event) => {
        event.preventDefault(); // Prevent default to avoid double events
        cell.classList.toggle('marked');
    };

    bingoCells.forEach(cell => {
        // Handle click events for desktop
        cell.addEventListener('click', (event) => toggleMark(cell, event));

        // Handle touch events for mobile
        cell.addEventListener('touchstart', (event) => toggleMark(cell, event));
    });
});

// wempec fan

const fan = document.getElementById('wempecker-fan-img');
let angle = 0;

function rotateFan() {
    angle = (angle + 1) % 360;
    fan.style.transform = `rotate(${angle}deg)`;
    requestAnimationFrame(rotateFan);
}

if (fan) {
    rotateFan();
}
