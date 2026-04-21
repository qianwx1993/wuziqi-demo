/**
 * 游戏控制类
 * 负责游戏流程管理、状态控制和模块协调
 */

import { CONFIG, getPlayerName, getPlayerSymbol } from './config.js';
import { Board } from './board.js';
import { RuleEngine } from './rules.js';

/**
 * 游戏控制类
 * @class Game
 */
export class Game {
    /**
     * 构造函数
     * @param {Board} board - 棋盘实例
     * @param {RuleEngine} ruleEngine - 规则引擎实例
     */
    constructor(board, ruleEngine) {
        /** @type {Board} 棋盘实例 */
        this.board = board;

        /** @type {RuleEngine} 规则引擎实例 */
        this.ruleEngine = ruleEngine;

        /** @type {Array<Array<number>>} 棋盘状态数组 */
        this.boardState = this._initBoardState();

        /** @type {number} 当前玩家 */
        this.currentPlayer = CONFIG.PLAYER.BLACK;

        /** @type {string} 游戏状态 */
        this.gameState = CONFIG.GAME_STATE.PLAYING;

        /** @type {number|null} 获胜玩家 */
        this.winner = null;

        /** @type {Array<{row: number, col: number, player: number}>} 历史记录（用于悔棋） */
        this.history = [];

        /** @type {Array<Function>} 状态变化监听器数组 */
        this.stateChangeListeners = [];

        /** @type {Array<Function>} 游戏结束监听器数组 */
        this.gameOverListeners = [];

        // 设置棋盘点击事件处理器
        this.board.setClickHandler(this._handleBoardClick.bind(this));

        // 绘制初始棋盘
        this.board.drawBoard();
    }

    /**
     * 初始化棋盘状态数组
     * @returns {Array<Array<number>>} 初始化后的棋盘状态
     * @private
     */
    _initBoardState() {
        const { BOARD_SIZE, PLAYER } = CONFIG;
        const board = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                board[i][j] = PLAYER.EMPTY;
            }
        }

        return board;
    }

    /**
     * 处理棋盘点击事件
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @private
     */
    _handleBoardClick(row, col) {
        // 如果游戏已结束，禁止落子
        if (this.gameState !== CONFIG.GAME_STATE.PLAYING) {
            return;
        }

        // 尝试落子
        const success = this.makeMove(row, col);

        // 如果落子失败，可以添加视觉反馈（可选）
        if (!success) {
            // 可以添加短暂抖动动画等效果
        }
    }

    /**
     * 落子
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @returns {boolean} 是否成功落子
     */
    makeMove(row, col) {
        // 验证落子位置是否有效
        if (!this.ruleEngine.isValidMove(this.boardState, row, col)) {
            return false;
        }

        // 记录落子到历史
        this.history.push({
            row,
            col,
            player: this.currentPlayer,
        });

        // 更新棋盘状态
        this.boardState[row][col] = this.currentPlayer;

        // 绘制棋子
        this.board.drawPiece(row, col, this.currentPlayer);

        // 更新最后落子标记
        this.board.clearLastMoveMarker();
        this.board.setLastMoveMarker(row, col);

        // 检查是否获胜
        if (this.ruleEngine.checkWin(this.boardState, row, col)) {
            this._handleWin(row, col);
            return true;
        }

        // 检查是否平局
        if (this.ruleEngine.checkDraw(this.boardState)) {
            this._handleDraw();
            return true;
        }

        // 切换玩家
        this._switchPlayer();

        // 通知状态变化
        this._notifyStateChange();

        return true;
    }

    /**
     * 处理获胜情况
     * @param {number} row - 最后落子行索引
     * @param {number} col - 最后落子列索引
     * @private
     */
    _handleWin(row, col) {
        this.gameState = CONFIG.GAME_STATE.FINISHED;
        this.winner = this.currentPlayer;

        // 通知游戏结束
        this._notifyGameOver();

        // 显示获胜弹窗
        setTimeout(() => {
            const winnerName = getPlayerName(this.winner);
            alert(`🎉 ${winnerName}获胜！`);
        }, 100);
    }

    /**
     * 处理平局情况
     * @private
     */
    _handleDraw() {
        this.gameState = CONFIG.GAME_STATE.DRAW;
        this.winner = null;

        // 通知游戏结束
        this._notifyGameOver();

        // 显示平局弹窗
        setTimeout(() => {
            alert('🤝 平局！');
        }, 100);
    }

    /**
     * 切换当前玩家
     * @private
     */
    _switchPlayer() {
        this.currentPlayer = this.currentPlayer === CONFIG.PLAYER.BLACK
            ? CONFIG.PLAYER.WHITE
            : CONFIG.PLAYER.BLACK;
    }

    /**
     * 悔棋
     * @returns {boolean} 是否成功悔棋
     */
    undoMove() {
        // 如果没有历史记录，无法悔棋
        if (this.history.length === 0) {
            return false;
        }

        // 如果游戏已结束，恢复到进行中状态
        if (this.gameState !== CONFIG.GAME_STATE.PLAYING) {
            this.gameState = CONFIG.GAME_STATE.PLAYING;
            this.winner = null;
        }

        // 取出最后一步
        const lastMove = this.history.pop();

        // 清空该位置的棋子
        this.boardState[lastMove.row][lastMove.col] = CONFIG.PLAYER.EMPTY;

        // 切换回上一个玩家
        this.currentPlayer = lastMove.player;

        // 重绘棋盘
        this._redrawBoard();

        // 通知状态变化
        this._notifyStateChange();

        return true;
    }

    /**
     * 重新绘制棋盘
     * @private
     */
    _redrawBoard() {
        // 清空并重绘棋盘
        this.board.clear();

        // 重绘所有棋子
        for (let i = 0; i < CONFIG.BOARD_SIZE; i++) {
            for (let j = 0; j < CONFIG.BOARD_SIZE; j++) {
                if (this.boardState[i][j] !== CONFIG.PLAYER.EMPTY) {
                    this.board.drawPiece(i, j, this.boardState[i][j]);
                }
            }
        }

        // 设置最后落子标记（如果有）
        if (this.history.length > 0) {
            const lastMove = this.history[this.history.length - 1];
            this.board.setLastMoveMarker(lastMove.row, lastMove.col);
            this.board._drawLastMoveMarker(
                this.board.boardToScreen(lastMove.row, lastMove.col).x,
                this.board.boardToScreen(lastMove.row, lastMove.col).y
            );
        }
    }

    /**
     * 开始新游戏
     */
    startNewGame() {
        // 重置游戏状态
        this.boardState = this._initBoardState();
        this.currentPlayer = CONFIG.PLAYER.BLACK;
        this.gameState = CONFIG.GAME_STATE.PLAYING;
        this.winner = null;
        this.history = [];

        // 清空并重绘棋盘
        this.board.clear();

        // 通知状态变化
        this._notifyStateChange();
    }

    /**
     * 获取当前玩家
     * @returns {number} 当前玩家（1=黑棋, 2=白棋）
     */
    getCurrentPlayer() {
        return this.currentPlayer;
    }

    /**
     * 获取当前玩家信息（用于 UI 显示）
     * @returns {{name: string, symbol: string}} 玩家信息
     */
    getCurrentPlayerInfo() {
        return {
            name: getPlayerName(this.currentPlayer),
            symbol: getPlayerSymbol(this.currentPlayer),
        };
    }

    /**
     * 获取游戏状态
     * @returns {string} 游戏状态
     */
    getGameState() {
        return this.gameState;
    }

    /**
     * 获取获胜方
     * @returns {number|null} 获胜玩家，无则返回 null
     */
    getWinner() {
        return this.winner;
    }

    /**
     * 检查是否可以悔棋
     * @returns {boolean} 是否可以悔棋
     */
    canUndo() {
        return this.history.length > 0;
    }

    /**
     * 注册状态变化监听器
     * @param {Function} callback - 回调函数
     */
    onStateChange(callback) {
        this.stateChangeListeners.push(callback);
    }

    /**
     * 注册游戏结束监听器
     * @param {Function} callback - 回调函数
     */
    onGameOver(callback) {
        this.gameOverListeners.push(callback);
    }

    /**
     * 通知状态变化
     * @private
     */
    _notifyStateChange() {
        const state = {
            currentPlayer: this.getCurrentPlayerInfo(),
            gameState: this.gameState,
            canUndo: this.canUndo(),
            moveCount: this.history.length,
        };

        for (const listener of this.stateChangeListeners) {
            listener(state);
        }
    }

    /**
     * 通知游戏结束
     * @private
     */
    _notifyGameOver() {
        const result = {
            winner: this.winner,
            gameState: this.gameState,
            moveCount: this.history.length,
        };

        for (const listener of this.gameOverListeners) {
            listener(result);
        }
    }
}
