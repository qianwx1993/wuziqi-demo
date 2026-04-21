/**
 * 规则引擎类
 * 负责游戏规则验证和胜负判定
 */

import { CONFIG } from './config.js';

/**
 * 规则引擎类
 * @class RuleEngine
 */
export class RuleEngine {
    /**
     * 构造函数
     */
    constructor() {
        // 当前无需初始化状态
    }

    /**
     * 检查落子位置是否有效
     * @param {Array<Array<number>>} board - 棋盘状态二维数组
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @returns {boolean} 位置是否有效
     */
    isValidMove(board, row, col) {
        const { BOARD_SIZE, PLAYER } = CONFIG;

        // 检查边界
        if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
            return false;
        }

        // 检查位置是否为空
        return board[row][col] === PLAYER.EMPTY;
    }

    /**
     * 检查是否获胜
     * 检测指定位置落子后是否形成五子连珠
     * @param {Array<Array<number>>} board - 棋盘状态二维数组
     * @param {number} row - 最后落子的行索引
     * @param {number} col - 最后落子的列索引
     * @returns {boolean} 是否获胜
     */
    checkWin(board, row, col) {
        const player = board[row][col];

        // 如果该位置没有棋子，返回 false
        if (player === CONFIG.PLAYER.EMPTY) {
            return false;
        }

        // 四个检测方向：[行增量, 列增量]
        const directions = [
            [0, 1],   // 水平方向
            [1, 0],   // 垂直方向
            [1, 1],   // 主对角线方向（左上到右下）
            [1, -1],  // 副对角线方向（右上到左下）
        ];

        // 检查四个方向
        for (const [dx, dy] of directions) {
            const count = this._countInDirection(board, row, col, dx, dy, player);
            if (count >= CONFIG.WIN_COUNT) {
                return true;
            }
        }

        return false;
    }

    /**
     * 在指定方向上统计连续同色棋子数量
     * @param {Array<Array<number>>} board - 棋盘状态二维数组
     * @param {number} row - 起始行索引
     * @param {number} col - 起始列索引
     * @param {number} dx - 行方向增量
     * @param {number} dy - 列方向增量
     * @param {number} player - 玩家类型
     * @returns {number} 连续棋子数量
     * @private
     */
    _countInDirection(board, row, col, dx, dy, player) {
        let count = 1; // 包含当前位置的棋子

        // 正向计数
        count += this._countInOneDirection(board, row, col, dx, dy, player);

        // 反向计数
        count += this._countInOneDirection(board, row, col, -dx, -dy, player);

        return count;
    }

    /**
     * 在单一方向上统计连续同色棋子数量
     * @param {Array<Array<number>>} board - 棋盘状态二维数组
     * @param {number} row - 起始行索引
     * @param {number} col - 起始列索引
     * @param {number} dx - 行方向增量
     * @param {number} dy - 列方向增量
     * @param {number} player - 玩家类型
     * @returns {number} 该方向的连续棋子数量
     * @private
     */
    _countInOneDirection(board, row, col, dx, dy, player) {
        const { BOARD_SIZE } = CONFIG;
        let count = 0;
        let r = row + dx;
        let c = col + dy;

        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
            if (board[r][c] === player) {
                count++;
                r += dx;
                c += dy;
            } else {
                break;
            }
        }

        return count;
    }

    /**
     * 检查是否平局（棋盘已满）
     * @param {Array<Array<number>>} board - 棋盘状态二维数组
     * @returns {boolean} 是否平局
     */
    checkDraw(board) {
        const { BOARD_SIZE, PLAYER } = CONFIG;

        // 遍历整个棋盘
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                // 如果仍有空位，则不是平局
                if (board[i][j] === PLAYER.EMPTY) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 获取所有可能的落子位置（空位）
     * @param {Array<Array<number>>} board - 棋盘状态二维数组
     * @returns {Array<{row: number, col: number}>} 所有可能的落子位置
     */
    getPossibleMoves(board) {
        const { BOARD_SIZE, PLAYER } = CONFIG;
        const moves = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] === PLAYER.EMPTY) {
                    moves.push({ row: i, col: j });
                }
            }
        }

        return moves;
    }

    /**
     * 评估当前局面分数（用于 AI）
     * 计算当前棋盘对指定玩家的有利程度
     * @param {Array<Array<number>>} board - 棋盘状态二维数组
     * @param {number} player - 要评估的玩家
     * @returns {number} 评估分数
     */
    evaluate(board, player) {
        const opponent = player === CONFIG.PLAYER.BLACK ? CONFIG.PLAYER.WHITE : CONFIG.PLAYER.BLACK;
        let score = 0;

        // 评估四个方向
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

        for (const [dx, dy] of directions) {
            score += this._evaluateDirection(board, dx, dy, player, opponent);
        }

        return score;
    }

    /**
     * 评估指定方向的局面分数
     * @param {Array<Array<number>>} board - 棋盘状态二维数组
     * @param {number} dx - 行方向增量
     * @param {number} dy - 列方向增量
     * @param {number} player - 要评估的玩家
     * @param {number} opponent - 对手玩家
     * @returns {number} 该方向的评估分数
     * @private
     */
    _evaluateDirection(board, dx, dy, player, opponent) {
        const { BOARD_SIZE } = CONFIG;
        let score = 0;

        // 遍历所有可能的起始位置
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                // 统计该位置的连珠情况
                const line = this._getLine(board, i, j, dx, dy);
                score += this._evaluateLine(line, player, opponent);
            }
        }

        return score;
    }

    /**
     * 获取从指定位置开始的连珠情况
     * @param {Array<Array<number>>} board - 棋盘状态二维数组
     * @param {number} row - 起始行索引
     * @param {number} col - 起始列索引
     * @param {number} dx - 行方向增量
     * @param {number} dy - 列方向增量
     * @returns {string} 连珠字符串（如 '11100' 表示连续三个黑棋）
     * @private
     */
    _getLine(board, row, col, dx, dy) {
        const { BOARD_SIZE } = CONFIG;
        let line = '';

        for (let k = 0; k < 5 && row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE; k++) {
            line += board[row][col];
            row += dx;
            col += dy;
        }

        return line;
    }

    /**
     * 评估连珠字符串的分数
     * @param {string} line - 连珠字符串
     * @param {number} player - 要评估的玩家
     * @param {number} opponent - 对手玩家
     * @returns {number} 该连珠的评估分数
     * @private
     */
    _evaluateLine(line, player, opponent) {
        const playerStr = String(player).repeat(5);
        const opponentStr = String(opponent).repeat(5);

        if (line.includes(playerStr)) {
            return 100000; // 必胜
        }
        if (line.includes(opponentStr)) {
            return -100000; // 必败
        }

        // 其他情况可以继续细化评估
        return 0;
    }
}
