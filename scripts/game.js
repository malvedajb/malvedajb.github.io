(function () {
    const board   = document.getElementById('game-board');
    if (!board) return;

    const statusEl    = document.getElementById('game-status');
    const scoreXEl    = document.getElementById('score-x');
    const scoreOEl    = document.getElementById('score-o');
    const scoreDrawEl = document.getElementById('score-draws');
    const resetBtn    = document.getElementById('reset-btn');
    const cells       = Array.from(board.querySelectorAll('.cell'));

    const WIN_LINES = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let state    = Array(9).fill('');
    let current  = 'X';
    let gameOver = false;
    let scores   = { X: 0, O: 0, D: 0 };

    function render() {
        cells.forEach((cell, i) => {
            cell.textContent = state[i];
            cell.className   = 'cell' + (state[i] ? ' taken ' + state[i].toLowerCase() : '');
        });
    }

    function checkWinner() {
        for (const line of WIN_LINES) {
            const [a, b, c] = line;
            if (state[a] && state[a] === state[b] && state[a] === state[c]) {
                return line;
            }
        }
        return null;
    }

    function handleClick(e) {
        const idx = parseInt(e.currentTarget.dataset.index);
        if (state[idx] || gameOver) return;

        state[idx] = current;
        render();

        const winLine = checkWinner();
        if (winLine) {
            winLine.forEach(i => cells[i].classList.add('win'));
            statusEl.textContent = `Player ${current} wins! 🎉`;
            scores[current]++;
            scoreXEl.textContent    = scores.X;
            scoreOEl.textContent    = scores.O;
            gameOver = true;
            return;
        }

        if (state.every(Boolean)) {
            statusEl.textContent = "It's a draw!";
            scores.D++;
            scoreDrawEl.textContent = scores.D;
            gameOver = true;
            return;
        }

        current = current === 'X' ? 'O' : 'X';
        statusEl.textContent = `Player ${current}'s turn`;
    }

    function reset() {
        state    = Array(9).fill('');
        current  = 'X';
        gameOver = false;
        statusEl.textContent = `Player ${current}'s turn`;
        render();
    }

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    resetBtn.addEventListener('click', reset);
}());
