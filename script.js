let level = 1;
let moves = 0;
let selectedTube = null;

const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink'];
const lightBackgroundColors = [
    '#f5f7fa', // Light gray
    '#e3f2fd', // Light blue
    '#e8f5e9', // Light green
    '#fffde7', // Light yellow
    '#fbe9e7', // Light orange
    '#f3e5f5', // Light purple
    '#fce4ec'  // Light pink
];
const gameContainer = document.getElementById('game-container');
const levelDisplay = document.getElementById('level');
const movesDisplay = document.getElementById('moves');
const body = document.body;

// Generate tubes and colors for the current level
function generateLevel() {
    gameContainer.innerHTML = '';
    selectedTube = null;
    const numTubes = level + 3;
    const numColors = level + 1;

    updateBackgroundColor();

    let colorDistribution = [];
    for (let i = 0; i < numColors; i++) {
        for (let j = 0; j < 4; j++) {
            colorDistribution.push(colors[i]);
        }
    }
    colorDistribution = colorDistribution.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numTubes; i++) {
        const tube = document.createElement('div');
        tube.classList.add('tube');
        tube.dataset.id = i;

        if (i < numColors) {
            for (let j = 0; j < 4; j++) {
                const segment = document.createElement('div');
                segment.classList.add('segment', colorDistribution.pop());
                tube.appendChild(segment);
            }
        }
        gameContainer.appendChild(tube);
    }

    const tubes = document.querySelectorAll('.tube');
    tubes.forEach(tube => tube.addEventListener('click', handleTubeClick));
}

// Change background color based on level
function updateBackgroundColor() {
    const newBackgroundColor = lightBackgroundColors[(level - 1) % lightBackgroundColors.length];
    body.style.backgroundColor = newBackgroundColor;
}

// Handle tube clicks
function handleTubeClick(event) {
    const tube = event.currentTarget;

    if (selectedTube === null) {
        if (tube.querySelectorAll('.segment').length > 0) {
            selectedTube = tube;
            tube.classList.add('selected');
        }
    } else {
        if (selectedTube === tube) {
            selectedTube.classList.remove('selected');
            selectedTube = null;
        } else {
            pourLiquid(selectedTube, tube);
            selectedTube.classList.remove('selected');
            selectedTube = null;
        }
    }
}

// Pour liquid between tubes
function pourLiquid(fromTube, toTube) {
    const fromSegments = fromTube.querySelectorAll('.segment');
    const toSegments = toTube.querySelectorAll('.segment');

    if (fromSegments.length === 0 || toSegments.length === 4) return;

    const fromColor = fromSegments[fromSegments.length - 1].classList[1];
    const toColor = toSegments.length > 0 ? toSegments[toSegments.length - 1].classList[1] : null;

    if (toColor === null || toColor === fromColor) {
        const segment = fromSegments[fromSegments.length - 1];
        fromTube.removeChild(segment);
        toTube.appendChild(segment);

        moves++;
        movesDisplay.textContent = moves;

        checkWin();
    }
}

// Check win condition
function checkWin() {
    const tubes = document.querySelectorAll('.tube');
    let isWin = true;

    tubes.forEach(tube => {
        const segments = tube.querySelectorAll('.segment');
        if (segments.length === 0) return;

        if (segments.length !== 4) {
            isWin = false;
        } else {
            const color = segments[0].classList[1];
            if ([...segments].some(segment => segment.classList[1] !== color)) {
                isWin = false;
            }
        }
    });

    if (isWin) {
        alert(`🎉 Wow Level ${level} Complete! 🎉`);
        level++;
        levelDisplay.textContent = level;
        moves = 0;
        movesDisplay.textContent = moves;
        generateLevel();
    }
}

// Event Listeners
document.querySelector('.reset').addEventListener('click', () => {
    moves = 0;
    movesDisplay.textContent = moves;
    generateLevel();
});
document.querySelector('.exit').addEventListener('click', () => {
    alert('Thanks for playing!');
    window.close();
});

generateLevel();
