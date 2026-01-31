// ===== Game State =====
const GameState = {
    playerSymbol: 'X',
    machineSymbol: 'O',
    difficulty: 'medium',
    roundsToWin: 3,
    playerScore: 0,
    machineScore: 0,
    currentRound: 1,
    board: ['', '', '', '', '', '', '', '', ''],
    isPlayerTurn: true,
    lastSettings: {},
    currentLanguage: 'es',
    playerName: ''
};

// ===== Translations =====
const translations = {
    es: {
        subtitle: "El clásico juego de estrategia",
        enter_name: "Ingresa tu nombre",
        select_language: "Selecciona Idioma",
        start: "Comenzar",
        choose_symbol: "Elige tu símbolo",
        difficulty: "Dificultad",
        easy: "Fácil",
        medium: "Normal",
        hard: "Difícil",
        rounds_to_win: "Partidas para ganar",
        start_game: "Comenzar Juego",
        who_starts: "¿Quién empieza?",
        drawing: "Sorteando...",
        you_start: "¡Tú empiezas!",
        machine_starts: "¡La máquina empieza!",
        you: "Tú",
        machine: "Máquina",
        round: "Ronda",
        goal: "Meta",
        your_turn: "Tu turno",
        machine_turn: "Turno de la máquina",
        you_won_round: "¡Ganaste esta ronda!",
        machine_won_round: "La máquina ganó esta ronda",
        draw: "¡Empate!",
        victory: "¡Victoria!",
        defeat: "Derrota",
        won_match: "Has ganado la partida",
        lost_match: "La máquina ha ganado esta vez",
        play_again: "Jugar de nuevo",
        change_settings: "Cambiar ajustes",
        back_to_menu: "Volver al menú"
    },
    en: {
        subtitle: "The classic strategy game",
        enter_name: "Enter your name",
        select_language: "Select Language",
        start: "Start",
        choose_symbol: "Choose your symbol",
        difficulty: "Difficulty",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        rounds_to_win: "Rounds to win",
        start_game: "Start Game",
        who_starts: "Who starts?",
        drawing: "Drawing...",
        you_start: "You start!",
        machine_starts: "Machine starts!",
        you: "You",
        machine: "Machine",
        round: "Round",
        goal: "Goal",
        your_turn: "Your turn",
        machine_turn: "Machine's turn",
        you_won_round: "You won this round!",
        machine_won_round: "Machine won this round!",
        draw: "Draw!",
        victory: "Victory!",
        defeat: "Defeat",
        won_match: "You won the match",
        lost_match: "The machine won this time",
        play_again: "Play again",
        change_settings: "Change settings",
        back_to_menu: "Back to menu"
    }
};

// ===== Winning Combinations =====
const WINNING_COMBINATIONS = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// ===== DOM Elements =====
const elements = {
    screens: {
        login: document.getElementById('login-screen'),
        language: document.getElementById('language-screen'),
        start: document.getElementById('start-screen'),
        lottery: document.getElementById('lottery-screen'),
        game: document.getElementById('game-screen'),
        result: document.getElementById('result-screen')
    },
    login: {
        emailInput: document.getElementById('email-input'),
        btnEmail: document.getElementById('btn-login-email'),
        btnGuest: document.getElementById('btn-login-guest')
    },
    language: {
        buttons: document.querySelectorAll('.language-btn'),
        goToStart: document.getElementById('go-to-start'),
        nameInput: document.getElementById('player-name-input')
    },
    lottery: {
        spinner: document.getElementById('lottery-spinner'),
        result: document.getElementById('lottery-result'),
        resultText: document.getElementById('lottery-result-text')
    },
    buttons: {
        startGame: document.getElementById('start-game'),
        backToMenu: document.getElementById('back-to-menu'),
        playAgain: document.getElementById('play-again'),
        changeSettings: document.getElementById('change-settings'),
        symbolX: document.getElementById('select-x'),
        symbolO: document.getElementById('select-o')
    },
    selectors: {
        difficulty: document.querySelectorAll('.difficulty-btn'),
        rounds: document.querySelectorAll('.rounds-btn')
    },
    game: {
        board: document.getElementById('game-board'),
        cells: document.querySelectorAll('[data-cell]'),
        statusText: document.getElementById('status-text'),
        playerScore: document.getElementById('player-score'),
        machineScore: document.getElementById('machine-score'),
        currentRound: document.getElementById('current-round'),
        totalRounds: document.getElementById('total-rounds'),
        playerSymbol: document.getElementById('player-symbol-display'),
        machineSymbol: document.getElementById('machine-symbol-display'),
        winningLine: document.getElementById('winning-line')
    },
    result: {
        icon: document.getElementById('result-icon'),
        title: document.getElementById('result-title'),
        subtitle: document.getElementById('result-subtitle'),
        playerScore: document.getElementById('final-player-score'),
        machineScore: document.getElementById('final-machine-score')
    }
};

// ===== Screen Management =====
function showScreen(screenName) {
    Object.values(elements.screens).forEach(screen => {
        screen.classList.remove('active');
    });
    elements.screens[screenName].classList.add('active');
}

// ===== Event Listeners =====
function initEventListeners() {
    // Symbol Selection
    elements.buttons.symbolX.addEventListener('click', () => selectSymbol('X'));
    elements.buttons.symbolO.addEventListener('click', () => selectSymbol('O'));

    // Difficulty Selection
    elements.selectors.difficulty.forEach(btn => {
        btn.addEventListener('click', () => selectDifficulty(btn.dataset.difficulty));
    });

    // Rounds Selection
    elements.selectors.rounds.forEach(btn => {
        btn.addEventListener('click', () => selectRounds(parseInt(btn.dataset.rounds)));
    });

    // Start Game
    elements.buttons.startGame.addEventListener('click', startGame);

    // Back to Menu
    elements.buttons.backToMenu.addEventListener('click', () => showScreen('start'));

    // Play Again
    elements.buttons.playAgain.addEventListener('click', playAgain);

    // Change Settings
    elements.buttons.changeSettings.addEventListener('click', () => showScreen('start'));

    // Cell Clicks
    elements.game.cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });

    // Sound Button
    document.getElementById('sound-btn').addEventListener('click', () => {
        toggleSound();
    });

    // Login Events
    elements.login.btnEmail.addEventListener('click', () => {
        const email = elements.login.emailInput.value.trim();
        if (email) {
            // Simulated login
            showScreen('language');
        } else {
            // Shake error
            const input = elements.login.emailInput;
            input.classList.add('input-error');
            setTimeout(() => input.classList.remove('input-error'), 500);
        }
    });

    // Remove old Google Listener
    // Google Button is now rendered by GIS

    elements.login.btnGuest.addEventListener('click', () => {
        showScreen('language');
    });

    // Language Selection
    elements.language.buttons.forEach(btn => {
        btn.addEventListener('click', () => selectLanguage(btn.dataset.lang));
    });

    // Go to Start Screen
    elements.language.goToStart.addEventListener('click', () => {
        const nameInput = elements.language.nameInput;
        const name = nameInput.value.trim();

        if (!name) {
            // Validation error
            nameInput.classList.add('input-error');
            nameInput.placeholder = GameState.currentLanguage === 'es' ? "¡Por favor ingresa tu nombre!" : "Please enter your name!";

            // Remove error class after animation to allow re-triggering
            setTimeout(() => {
                nameInput.classList.remove('input-error');
            }, 500);
            return;
        }

        GameState.playerName = name;
        showScreen('start');
        updateTexts(); // Update texts again to show player name
    });
}

// ===== Language Functions =====
function selectLanguage(lang) {
    GameState.currentLanguage = lang;
    elements.language.buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    updateTexts();
}

function updateTexts() {
    const t = translations[GameState.currentLanguage];
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
}

// ===== Selection Functions =====
function selectSymbol(symbol) {
    GameState.playerSymbol = symbol;
    GameState.machineSymbol = symbol === 'X' ? 'O' : 'X';

    elements.buttons.symbolX.classList.toggle('active', symbol === 'X');
    elements.buttons.symbolO.classList.toggle('active', symbol === 'O');
}

function selectDifficulty(difficulty) {
    GameState.difficulty = difficulty;
    elements.selectors.difficulty.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });
}

function selectRounds(rounds) {
    GameState.roundsToWin = parseInt(rounds);
    elements.selectors.rounds.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.rounds) === rounds);
    });
}

// ===== Sound Management =====
const audio = {
    bgMusic: document.getElementById('bg-music'),
    btn: document.getElementById('sound-btn'),
    icon: document.querySelector('.sound-icon'),
    isPlaying: false
};

function toggleSound() {
    if (audio.isPlaying) {
        audio.bgMusic.pause();
        audio.icon.textContent = '🔈';
        audio.btn.classList.remove('playing');
        audio.btn.setAttribute('aria-label', 'Activar sonido');
    } else {
        audio.bgMusic.volume = 0.3; // Lower volume for background music
        audio.bgMusic.play().catch(e => console.log('Audio playback prevented:', e));
        audio.icon.textContent = '🔊';
        audio.btn.classList.add('playing');
        audio.btn.setAttribute('aria-label', 'Desactivar sonido');
    }
    audio.isPlaying = !audio.isPlaying;
}

// Helper to get text
function getText(key) {
    if (key === 'you' && GameState.playerName) {
        return GameState.playerName;
    }
    return translations[GameState.currentLanguage][key] || key;
}

// ===== Game Functions =====
function startGame() {
    // Start music if not playing and allowed by interaction
    if (!audio.isPlaying) {
        // Try to start music on user interaction (start game)
        toggleSound();
    }
    // Save settings
    GameState.lastSettings = {
        playerSymbol: GameState.playerSymbol,
        machineSymbol: GameState.machineSymbol,
        difficulty: GameState.difficulty,
        roundsToWin: parseInt(GameState.roundsToWin) || 3
    };

    // Ensure roundsToWin is set properly
    GameState.roundsToWin = parseInt(GameState.roundsToWin) || 3;

    // Reset scores
    GameState.playerScore = 0;
    GameState.machineScore = 0;
    GameState.currentRound = 1;

    // Update UI
    updateScoreDisplay();
    updateSymbolDisplay();
    elements.game.totalRounds.textContent = GameState.roundsToWin;

    // Run lottery to determine who starts
    runLottery();
}

function runLottery() {
    // Reset lottery UI
    elements.lottery.spinner.classList.remove('stopped');
    elements.lottery.result.classList.remove('show');
    elements.lottery.resultText.className = 'result-text';

    // Reset symbols
    const xSymbol = elements.lottery.spinner.querySelector('.lottery-x');
    const oSymbol = elements.lottery.spinner.querySelector('.lottery-o');
    xSymbol.style.display = 'block';
    oSymbol.style.display = 'block';
    xSymbol.classList.remove('winner');
    oSymbol.classList.remove('winner');

    showScreen('lottery');

    // Randomly determine who starts
    const playerStarts = Math.random() < 0.5;
    GameState.isPlayerTurn = playerStarts;

    // Stop animation after 2.5 seconds (slightly longer)
    setTimeout(() => {
        elements.lottery.spinner.classList.add('stopped');

        // Determine winning symbol based on who starts
        const winningSymbol = playerStarts ? GameState.playerSymbol : GameState.machineSymbol;

        if (winningSymbol === 'X') {
            xSymbol.style.display = 'block';
            oSymbol.style.display = 'none';
            xSymbol.classList.add('winner');
        } else {
            xSymbol.style.display = 'none';
            oSymbol.style.display = 'block';
            oSymbol.classList.add('winner');
        }

        if (playerStarts) {
            elements.lottery.resultText.textContent = getText('you_start');
            elements.lottery.resultText.classList.add('player-starts');
        } else {
            elements.lottery.resultText.textContent = getText('machine_starts');
            elements.lottery.resultText.classList.add('machine-starts');
        }

        // Show result
        setTimeout(() => {
            elements.lottery.result.classList.add('show');
        }, 500); // Wait for symbol animation

        // Transition to game screen
        setTimeout(() => {
            // Reset symbol display for next lottery
            xSymbol.style.display = 'block';
            oSymbol.style.display = 'block';
            xSymbol.classList.remove('winner');
            oSymbol.classList.remove('winner');

            resetBoard(true);
            showScreen('game');
        }, 2800); // 2.5s + 0.3s delay => longer wait to see result
    }, 2500);
}

function resetBoard(preserveTurn = false) {
    GameState.board = ['', '', '', '', '', '', '', '', ''];
    GameState.gameActive = true;

    // Only set turn based on symbol if not preserving from lottery
    if (!preserveTurn) {
        GameState.isPlayerTurn = Math.random() < 0.5;
    }

    elements.game.cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'taken', 'winner');
    });

    elements.game.winningLine.classList.remove('show');
    elements.game.winningLine.style.cssText = '';

    elements.game.currentRound.textContent = GameState.currentRound;

    if (GameState.isPlayerTurn) {
        updateStatus(getText('your_turn'), 'player-turn');
    } else {
        updateStatus(getText('machine_turn'), 'machine-turn');
        setTimeout(machineTurn, 800);
    }
}

function handleCellClick(cell) {
    const index = parseInt(cell.dataset.index);

    if (!GameState.gameActive || !GameState.isPlayerTurn || GameState.board[index] !== '') {
        return;
    }

    makeMove(index, GameState.playerSymbol);

    if (checkGameEnd()) return;

    GameState.isPlayerTurn = false;
    updateStatus(getText('machine_turn'), 'machine-turn');
    setTimeout(machineTurn, 600);
}

function makeMove(index, symbol) {
    GameState.board[index] = symbol;
    const cell = elements.game.cells[index];
    cell.textContent = symbol === 'X' ? '✕' : '⬤';
    cell.classList.add(symbol.toLowerCase(), 'taken');
}

function updateStatus(text, className = '') {
    elements.game.statusText.textContent = text;
    elements.game.statusText.className = 'status-text';
    if (className) {
        elements.game.statusText.classList.add(className);
    }
}

function updateScoreDisplay() {
    elements.game.playerScore.textContent = GameState.playerScore;
    elements.game.machineScore.textContent = GameState.machineScore;
}

function updateSymbolDisplay() {
    elements.game.playerSymbol.textContent = GameState.playerSymbol === 'X' ? '✕' : '○';
    elements.game.machineSymbol.textContent = GameState.machineSymbol === 'X' ? '✕' : '○';

    // Update colors
    const playerPanel = document.querySelector('.player-score .score-icon span');
    const machinePanel = document.querySelector('.machine-score .score-icon span');

    if (GameState.playerSymbol === 'X') {
        playerPanel.style.color = 'var(--x-color)';
        machinePanel.style.color = 'var(--o-color)';
    } else {
        playerPanel.style.color = 'var(--o-color)';
        machinePanel.style.color = 'var(--x-color)';
    }
}

// ===== Machine AI =====
function machineTurn() {
    if (!GameState.gameActive) return;

    let move;

    switch (GameState.difficulty) {
        case 'easy':
            move = getEasyMove();
            break;
        case 'medium':
            move = getMediumMove();
            break;
        case 'hard':
            move = getHardMove();
            break;
        default:
            move = getMediumMove();
    }

    if (move !== null) {
        makeMove(move, GameState.machineSymbol);

        if (checkGameEnd()) return;

        GameState.isPlayerTurn = true;
        updateStatus(getText('your_turn'), 'player-turn');
    }
}

function getEmptyCells() {
    return GameState.board.map((cell, index) => cell === '' ? index : null).filter(i => i !== null);
}

function getEasyMove() {
    // Random move
    const emptyCells = getEmptyCells();
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getMediumMove() {
    // 70% chance of smart move, 30% random
    if (Math.random() < 0.7) {
        return getSmartMove();
    }
    return getEasyMove();
}

function getHardMove() {
    return minimax(GameState.board, GameState.machineSymbol).index;
}

function getSmartMove() {
    // 1. Win if possible
    const winMove = findWinningMove(GameState.machineSymbol);
    if (winMove !== null) return winMove;

    // 2. Block player's winning move
    const blockMove = findWinningMove(GameState.playerSymbol);
    if (blockMove !== null) return blockMove;

    // 3. Take center if available
    if (GameState.board[4] === '') return 4;

    // 4. Take a corner
    const corners = [0, 2, 6, 8].filter(i => GameState.board[i] === '');
    if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
    }

    // 5. Take any available
    return getEasyMove();
}

function findWinningMove(symbol) {
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        const cells = [GameState.board[a], GameState.board[b], GameState.board[c]];

        if (cells.filter(cell => cell === symbol).length === 2 &&
            cells.filter(cell => cell === '').length === 1) {
            return combo[cells.indexOf('')];
        }
    }
    return null;
}

// Minimax Algorithm for Hard difficulty
function minimax(board, player, depth = 0) {
    const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(i => i !== null);

    // Check terminal states
    if (checkWinner(board, GameState.playerSymbol)) {
        return { score: -10 + depth };
    }
    if (checkWinner(board, GameState.machineSymbol)) {
        return { score: 10 - depth };
    }
    if (emptyCells.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (const index of emptyCells) {
        const move = { index };
        board[index] = player;

        if (player === GameState.machineSymbol) {
            move.score = minimax(board, GameState.playerSymbol, depth + 1).score;
        } else {
            move.score = minimax(board, GameState.machineSymbol, depth + 1).score;
        }

        board[index] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === GameState.machineSymbol) {
        let bestScore = -Infinity;
        for (const move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (const move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

function checkWinner(board, symbol) {
    return WINNING_COMBINATIONS.some(combo => {
        return combo.every(index => board[index] === symbol);
    });
}

// ===== Game End Logic =====
function checkGameEnd() {
    // Check for winner
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (GameState.board[a] &&
            GameState.board[a] === GameState.board[b] &&
            GameState.board[a] === GameState.board[c]) {

            GameState.gameActive = false;
            const winner = GameState.board[a];

            // Highlight winning cells
            [a, b, c].forEach(index => {
                elements.game.cells[index].classList.add('winner');
            });

            // Draw winning line
            drawWinningLine(combo);

            if (winner === GameState.playerSymbol) {
                GameState.playerScore++;
                updateStatus(getText('you_won_round'), 'player-turn');
            } else {
                GameState.machineScore++;
                updateStatus(getText('machine_won_round'), 'machine-turn');
            }

            updateScoreDisplay();

            setTimeout(() => {
                checkMatchEnd();
            }, 1500);

            return true;
        }
    }

    // Check for draw
    if (!GameState.board.includes('')) {
        GameState.gameActive = false;
        updateStatus(getText('draw'));

        setTimeout(() => {
            checkMatchEnd();
        }, 1500);

        return true;
    }

    return false;
}

function drawWinningLine(combo) {
    const line = elements.game.winningLine;
    const board = elements.game.board;
    const cells = elements.game.cells;

    const boardRect = board.getBoundingClientRect();
    const cellRects = Array.from(cells).map(cell => cell.getBoundingClientRect());

    const startRect = cellRects[combo[0]];
    const endRect = cellRects[combo[2]];

    const startX = startRect.left + startRect.width / 2 - boardRect.left;
    const startY = startRect.top + startRect.height / 2 - boardRect.top;
    const endX = endRect.left + endRect.width / 2 - boardRect.left;
    const endY = endRect.top + endRect.height / 2 - boardRect.top;

    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    line.style.width = `${length}px`;
    line.style.height = '6px';
    line.style.left = `${startX}px`;
    line.style.top = `${startY - 3}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 50%';
    line.classList.add('show');
}

function checkMatchEnd() {
    if (GameState.playerScore >= GameState.roundsToWin) {
        showResult('win');
    } else if (GameState.machineScore >= GameState.roundsToWin) {
        showResult('lose');
    } else {
        // Next round
        GameState.currentRound++;
        resetBoard();
    }
}

function showResult(result) {
    elements.result.playerScore.textContent = GameState.playerScore;
    elements.result.machineScore.textContent = GameState.machineScore;

    if (result === 'win') {
        elements.result.icon.textContent = '🏆';
        elements.result.title.textContent = getText('victory');
        elements.result.title.classList.remove('lose');
        elements.result.subtitle.textContent = getText('won_match');
    } else {
        elements.result.icon.textContent = '😔';
        elements.result.title.textContent = getText('defeat');
        elements.result.title.classList.add('lose');
        elements.result.subtitle.textContent = getText('lost_match');
    }

    showScreen('result');
}

function playAgain() {
    // Restore last settings
    Object.assign(GameState, GameState.lastSettings);
    startGame();
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();

    // Initialize Google Button
    // ⚠️ REEMPLAZA 'YOUR_GOOGLE_CLIENT_ID' con tu Client ID real de Google Cloud Console
    // Ejemplo: '123456789-abcdefgh.apps.googleusercontent.com'
    const GOOGLE_CLIENT_ID = '752364168606-t10sqmr6ob9l6s4qoh78524lq55uud59.apps.googleusercontent.com';

    // Función para inicializar Google con reintento (sin botón falso)
    const initGoogle = () => {
        if (window.google && window.google.accounts) {
            try {
                google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse
                });
                google.accounts.id.renderButton(
                    document.getElementById("google-btn-container"),
                    { theme: "outline", size: "large", width: "300" }
                );
                console.log("Botón de Google inicializado correctamente");
            } catch (e) {
                console.error("Error inicializando botón Google:", e);
            }
        } else {
            // Si no está listo, seguir esperando
            setTimeout(initGoogle, 100);
        }
    };

    // Iniciar el proceso de carga
    initGoogle();
});

function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    const responsePayload = decodeJwtResponse(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    // Auto-fill name
    if (responsePayload.given_name) {
        GameState.playerName = responsePayload.given_name;
        elements.language.nameInput.value = responsePayload.given_name;
    }

    showScreen('language');
}

function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
