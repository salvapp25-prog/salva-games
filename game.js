import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===== Firebase Configuration =====
// ⚠️ IMPORTANTE: REEMPLAZA ESTO CON TUS DATOS DE FIREBASE CONSOLE ⚠️
const firebaseConfig = {
    apiKey: "AIzaSyDpxc-sx1zNzMeuJjM0cwHvwZJtvRjDctk",
    authDomain: "tateti-sencillo.firebaseapp.com",
    projectId: "tateti-sencillo",
    storageBucket: "tateti-sencillo.firebasestorage.app",
    messagingSenderId: "123656314569",
    appId: "1:123656314569:web:0fd22776ee993e57b43718",
    measurementId: "G-8XY8PH3EXC"
};

// Initialize Firebase
let auth;
try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} catch (error) {
    console.warn("Firebase no está configurado.");
}

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
    playerName: '',
    isLoginMode: true // true = Login, false = Register
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
        goal: "Para Ganar",
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
        goal: "To Win",
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
        splash: document.getElementById('splash-screen'),
        login: document.getElementById('login-screen'),
        language: document.getElementById('language-screen'),
        start: document.getElementById('start-screen'),
        lottery: document.getElementById('lottery-screen'),
        game: document.getElementById('game-screen'),
        result: document.getElementById('result-screen')
    },
    login: {
        emailInput: document.getElementById('email-input'),
        passwordInput: document.getElementById('password-input'),
        passwordConfirmInput: document.getElementById('password-confirm-input'),
        confirmContainer: document.getElementById('confirm-password-container'),
        togglePassword: document.getElementById('toggle-password'),
        btnAction: document.getElementById('btn-action-email'),
        btnText: document.getElementById('btn-text-email'),
        toggleContainer: document.getElementById('auth-toggle-container'),
        btnSwitch: document.getElementById('btn-switch-auth'),
        msgContainer: document.getElementById('auth-message'),
        btnGuest: document.getElementById('btn-login-guest')
    },
    profile: {
        container: document.getElementById('user-profile-corner'),
        trigger: document.getElementById('profile-trigger'),
        dropdown: document.getElementById('profile-dropdown'),
        name: document.getElementById('display-name'),
        initial: document.getElementById('user-initial'),
        logout: document.getElementById('logout-btn')
    },
    language: {
        buttons: document.querySelectorAll('.language-btn')
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

    // Home Button Logic
    const btnHome = document.getElementById('home-btn');
    if (btnHome) {
        btnHome.addEventListener('click', () => {
            // Regresar al splash y recargar para limpiar estado
            showScreen('splash');
            location.reload();
        });
    }

    // Splash Screen Logic
    const btnEnter = document.getElementById('btn-enter-game');
    if (btnEnter) {
        btnEnter.addEventListener('click', () => {
            startMusic();
            showScreen('login');
        });
    }

    // Sound Button (Mute Toggle)
    document.getElementById('sound-btn').addEventListener('click', () => {
        toggleMute();
    });

    // Volume Slider Listener
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            updateVolume(e.target.value);
        });
    }

    // Auth State Logic
    let isPasswordShown = false;

    // Toggle Login/Register
    elements.login.btnSwitch.addEventListener('click', () => {
        GameState.isLoginMode = !GameState.isLoginMode;

        // Update UI
        document.getElementById('auth-toggle-text').textContent = GameState.isLoginMode ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?";
        elements.login.btnSwitch.textContent = GameState.isLoginMode ? "Regístrate" : "Inicia Sesión";
        elements.login.btnText.textContent = GameState.isLoginMode ? "Iniciar Sesión" : "Registrarse";
        elements.login.msgContainer.style.display = 'none';
        elements.login.passwordInput.value = '';
        elements.login.passwordConfirmInput.value = '';

        // Show/Hide Confirm Password
        elements.login.confirmContainer.style.display = GameState.isLoginMode ? 'none' : 'block';
    });

    // Forgot Password Logic
    const btnForgot = document.getElementById('btn-forgot-password');
    if (btnForgot) {
        btnForgot.addEventListener('click', async () => {
            const email = elements.login.emailInput.value.trim();
            if (!email) {
                shakeInput(elements.login.emailInput);
                showMessage("Por favor, ingresa tu correo para recuperar la clave.", "#ff4757");
                return;
            }

            try {
                await sendPasswordResetEmail(auth, email);
                showMessage("✅ Correo enviado. Revisa tu bandeja de entrada.", "#4cd137");
            } catch (error) {
                console.error(error);
                let msg = "Error al enviar correo.";
                if (error.code === 'auth/user-not-found') msg = "No hay una cuenta con ese correo.";
                if (error.code === 'auth/invalid-email') msg = "El correo no es válido.";
                showMessage(msg, "#ff4757");
            }
        });
    }

    // Password Visibility Toggle
    elements.login.togglePassword.addEventListener('click', () => {
        const type = elements.login.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        elements.login.passwordInput.setAttribute('type', type);
        const icon = document.getElementById('eye-icon');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });

    // Profile Dropdown Toggle
    elements.profile.trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.profile.container.classList.toggle('active');
    });

    // Close dropdown on click outside
    document.addEventListener('click', () => {
        elements.profile.container.classList.remove('active');
    });

    // Logout Functionality
    elements.profile.logout.addEventListener('click', () => {
        auth.signOut().then(() => {
            elements.profile.container.style.display = 'none';
            showScreen('login');
            location.reload(); // Refresh to clear state
        });
    });

    // Language Selection (Now from dropdown)
    elements.language.buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectLanguage(btn.dataset.lang);
            elements.profile.container.classList.remove('active');
        });
    });

    // Email Button Click
    elements.login.btnAction.addEventListener('click', async () => {
        startMusic(); // Ensure music starts on click
        const email = elements.login.emailInput.value.trim();
        const password = elements.login.passwordInput.value.trim();
        const confirmPassword = elements.login.passwordConfirmInput.value.trim();

        // 2. Validate Inputs
        if (!email) { shakeInput(elements.login.emailInput); return; }
        if (!password) { shakeInput(elements.login.passwordInput); return; }

        if (!GameState.isLoginMode) {
            if (!confirmPassword) { shakeInput(elements.login.passwordConfirmInput); return; }
            if (password !== confirmPassword) {
                shakeInput(elements.login.passwordInput);
                shakeInput(elements.login.passwordConfirmInput);
                showMessage("❌ Las contraseñas no coinciden", "#ff4757");
                return;
            }
        }

        if (!auth) {
            alert("⚠️ Configura Firebase en game.js para usar esta función.");
            return;
        }

        elements.login.btnAction.disabled = true;
        elements.login.btnText.textContent = "Procesando...";
        elements.login.msgContainer.style.display = 'none';

        try {
            if (GameState.isLoginMode) {
                // LOGIN
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                if (user.emailVerified) {
                    // Success!
                    let name = user.displayName || user.email.split('@')[0];
                    name = name.charAt(0).toUpperCase() + name.slice(1);

                    GameState.playerName = name;
                    updateUserProfileUI(name);
                    showScreen('start');
                } else {
                    // Not verified
                    showMessage("⚠️ Debes verificar tu correo antes de jugar.", "#ff4757");
                    // Opcional: Reenviar correo si se desea
                    // await sendEmailVerification(user); 
                }
            } else {
                // REGISTER
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Send Verification
                await sendEmailVerification(user);

                showMessage("✅ ¡Cuenta creada! Revisa tu correo para verificarla.", "#4cd137");

                // Switch back to login mode automatically
                GameState.isLoginMode = true;
                document.getElementById('auth-toggle-text').textContent = "¿No tienes cuenta?";
                elements.login.btnSwitch.textContent = "Regístrate";
                elements.login.btnText.textContent = "Iniciar Sesión";

                // Clear password
                elements.login.passwordInput.value = '';
            }
        } catch (error) {
            console.error(error);
            let msg = "Error de autenticación.";
            if (error.code === 'auth/invalid-credential') msg = "Correo o contraseña incorrectos.";
            if (error.code === 'auth/email-already-in-use') msg = "Este correo ya está registrado.";
            if (error.code === 'auth/weak-password') msg = "La contraseña debe tener al menos 6 caracteres.";
            showMessage(msg, "#ff4757");
        }

        elements.login.btnAction.disabled = false;
        if (!GameState.isLoginMode) elements.login.btnText.textContent = "Registrarse";
        else elements.login.btnText.textContent = "Iniciar Sesión";
    });

    function shakeInput(input) {
        input.classList.add('input-error');
        setTimeout(() => input.classList.remove('input-error'), 1000);
    }

    function showMessage(text, color) {
        elements.login.msgContainer.textContent = text;
        elements.login.msgContainer.style.color = color;
        elements.login.msgContainer.style.display = 'block';
    }

    elements.login.btnGuest.addEventListener('click', () => {
        startMusic(); // Ensure music starts
        const guestName = GameState.currentLanguage === 'es' ? "Invitado" : "Guest";
        GameState.playerName = guestName;
        updateUserProfileUI(guestName);
        showScreen('start');
    });
}

function updateUserProfileUI(name) {
    elements.profile.name.textContent = name;
    elements.profile.initial.textContent = name.charAt(0).toUpperCase();
    elements.profile.container.style.display = 'block';
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
    icon: document.getElementById('sound-icon'),
    slider: document.getElementById('volume-slider'),
    isPlaying: false,
    lastVolume: 0.5
};

function updateVolume(val) {
    const volume = parseFloat(val);
    audio.bgMusic.volume = volume;
    audio.lastVolume = volume > 0 ? volume : audio.lastVolume;

    // Unmute if it was muted and volume is increased
    if (volume > 0) {
        audio.bgMusic.muted = false;
    }

    // Update Slider if changed programmatically
    if (audio.slider) audio.slider.value = volume;

    // Update Icons
    if (volume === 0) {
        audio.icon.className = 'fas fa-volume-mute';
        audio.btn.classList.remove('playing');
    } else if (volume < 0.5) {
        audio.icon.className = 'fas fa-volume-down';
        audio.btn.classList.add('playing');
    } else {
        audio.icon.className = 'fas fa-volume-up';
        audio.btn.classList.add('playing');
    }

    // Play if not playing but volume increased
    if (volume > 0 && !audio.isPlaying) {
        startMusic();
    }
}

function startMusic() {
    if (audio.isPlaying) return;

    // Ensure music is not muted and volume is set before playing
    audio.bgMusic.muted = false;
    if (audio.bgMusic.volume === 0) {
        updateVolume(audio.lastVolume || 0.5);
    }

    audio.bgMusic.play().then(() => {
        audio.isPlaying = true;
        audio.btn.classList.add('playing');
        console.log('Music started successfully');
    }).catch(e => {
        console.log('Audio playback still prevented:', e);
    });
}

function toggleMute() {
    if (audio.bgMusic.volume > 0) {
        updateVolume(0);
    } else {
        updateVolume(audio.lastVolume || 0.5);
    }
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
        startMusic();
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

    // Función para renderizar el botón
    const renderGoogleButton = () => {
        try {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse
            });
            google.accounts.id.renderButton(
                document.getElementById("google-btn-container"),
                { theme: "outline", size: "large", width: "300" }
            );
        } catch (e) {
            console.error("Error rendering Google button:", e);
            document.getElementById("google-btn-container").innerText = "Error config Google";
        }
    };

    // Cargar librería de Google dinámicamente (Más robusto)
    if (window.google && window.google.accounts) {
        renderGoogleButton();
    } else {
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = renderGoogleButton;
        script.onerror = () => {
            document.getElementById("google-btn-container").innerHTML =
                '<span style="color:#ff4757; font-size: 0.85rem;">No se cargó Google. ¿Tienes AdBlock activado?</span>';
        };
        document.head.appendChild(script);
    }
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
        const name = responsePayload.given_name;
        GameState.playerName = name;
        updateUserProfileUI(name);
    }

    showScreen('start');
}

function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
