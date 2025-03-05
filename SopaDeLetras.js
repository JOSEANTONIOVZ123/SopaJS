import chalk from 'chalk';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const words = ["MARIPOSA", "TEJON", "BAYA"];
const gridSize = 10;
let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
let foundWords = new Set();
let wordPositions = new Map(); // Almacena las posiciones de las palabras en la cuadrícula

// Función para colocar palabras y registrar sus posiciones
function placeWord(word) {
    let placed = false;
    while (!placed) {
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);
        let dir = Math.random();
        let positions = [];

        if (dir < 0.33 && col + word.length <= gridSize) { // Horizontal
            let fits = word.split('').every((_, i) => !grid[row][col + i] || grid[row][col + i] === word[i]);
            if (fits) {
                word.split('').forEach((char, i) => {
                    grid[row][col + i] = char;
                    positions.push([row, col + i]);
                });
                wordPositions.set(word, positions);
                placed = true;
            }
        } else if (dir < 0.66 && row + word.length <= gridSize) { // Vertical
            let fits = word.split('').every((_, i) => !grid[row + i][col] || grid[row + i][col] === word[i]);
            if (fits) {
                word.split('').forEach((char, i) => {
                    grid[row + i][col] = char;
                    positions.push([row + i, col]);
                });
                wordPositions.set(word, positions);
                placed = true;
            }
        } else if (dir >= 0.66 && row + word.length <= gridSize && col + word.length <= gridSize) { // Diagonal
            let fits = word.split('').every((_, i) => !grid[row + i][col + i] || grid[row + i][col + i] === word[i]);
            if (fits) {
                word.split('').forEach((char, i) => {
                    grid[row + i][col + i] = char;
                    positions.push([row + i, col + i]);
                });
                wordPositions.set(word, positions);
                placed = true;
            }
        }
    }
}

words.forEach(word => placeWord(word));

// Rellenar la sopa con letras aleatorias
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        if (!grid[i][j]) grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
}

console.log("\nBienvenido a la sopa de letras");

// Imprimir la cuadrícula con palabras resaltadas en verde si han sido encontradas
function printGrid() {
    console.log(`\nEncuentra las ${words.length - foundWords.size} palabras restantes: `);
    grid.forEach((row, rowIndex) => {
        console.log(row.map((letter, colIndex) => {
            let highlight = false;
            foundWords.forEach(word => {
                if (wordPositions.has(word)) {
                    let positions = wordPositions.get(word);
                    if (positions.some(([r, c]) => r === rowIndex && c === colIndex)) {
                        highlight = true;
                    }
                }
            });
            return highlight ? chalk.green(letter) : letter;
        }).join(' '));
    });
}

printGrid();

// Función para procesar palabras ingresadas por el usuario
function askForWord() {
    rl.question("Ingresa una palabra encontrada (o escribe FIN para salir): ", (answer) => {
        let word = answer.toUpperCase();
        if (word === "FIN") {
            console.log("Juego terminado. ¡Gracias por jugar!");
            rl.close();
            return;
        }
        if (words.includes(word) && !foundWords.has(word)) {
            foundWords.add(word);
            console.log("¡Correcto! La palabra está en la sopa de letras.");
            printGrid();
            console.log("Palabras encontradas: " + Array.from(foundWords).join(", "));
        } else if (foundWords.has(word)) {
            console.log("Ya encontraste esta palabra, intenta con otra.");
        } else {
            console.log("Palabra no encontrada, intenta de nuevo.");
        }
        
        if (foundWords.size === words.length) {
            console.log("¡Felicidades! Has encontrado todas las palabras.");
            rl.close();
        } else {
            askForWord();
        }
    });
}

askForWord();


