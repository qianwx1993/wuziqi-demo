/**
 * 棋盘类
 * 负责棋盘渲染、棋子绘制和坐标转换
 */

import { CONFIG } from './config.js';

/**
 * 棋盘类
 * @class Board
 */
export class Board {
    /**
     * 构造函数
     * @param {HTMLCanvasElement} canvas - Canvas 元素
     */
    constructor(canvas) {
        /** @type {HTMLCanvasElement} Canvas 元素 */
        this.canvas = canvas;

        /** @type {CanvasRenderingContext2D} Canvas 2D 渲染上下文 */
        this.ctx = canvas.getContext('2d');

        /** @type {number} 最后落子标记的行索引 */
        this.lastMoveRow = null;

        /** @type {number} 最后落子标记的列索引 */
        this.lastMoveCol = null;

        /** @type {Function|null} 点击事件处理器 */
        this.clickHandler = null;

        // 设置 Canvas 尺寸
        this._setupCanvas();

        // 绑定点击事件
        this._bindEvents();
    }

    /**
     * 设置 Canvas 尺寸
     * @private
     */
    _setupCanvas() {
        const size = CONFIG.BOARD_SIZE * CONFIG.CELL_SIZE + CONFIG.BOARD_PADDING * 2;
        this.canvas.width = size;
        this.canvas.height = size;
    }

    /**
     * 绑定事件监听器
     * @private
     */
    _bindEvents() {
        this.canvas.addEventListener('click', (event) => {
            if (!this.clickHandler) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const position = this.screenToBoard(x, y);
            if (position) {
                this.clickHandler(position.row, position.col);
            }
        });
    }

    /**
     * 绘制棋盘
     * 包括网格线、星位点等
     */
    drawBoard() {
        const { ctx, canvas } = this;
        const { BOARD_PADDING, BOARD_SIZE, CELL_SIZE, COLORS } = CONFIG;

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制棋盘背景
        ctx.fillStyle = COLORS.BOARD_BACKGROUND;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制网格线
        ctx.strokeStyle = COLORS.GRID_LINE;
        ctx.lineWidth = 1;

        // 绘制横线
        for (let i = 0; i < BOARD_SIZE; i++) {
            const y = BOARD_PADDING + i * CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(BOARD_PADDING, y);
            ctx.lineTo(canvas.width - BOARD_PADDING, y);
            ctx.stroke();
        }

        // 绘制竖线
        for (let j = 0; j < BOARD_SIZE; j++) {
            const x = BOARD_PADDING + j * CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(x, BOARD_PADDING);
            ctx.lineTo(x, canvas.height - BOARD_PADDING);
            ctx.stroke();
        }

        // 绘制星位点
        this._drawStarPoints();
    }

    /**
     * 绘制星位点
     * @private
     */
    _drawStarPoints() {
        const { ctx } = this;
        const { STAR_POINTS, STAR_POINT_RADIUS, COLORS, BOARD_PADDING, CELL_SIZE } = CONFIG;

        ctx.fillStyle = COLORS.STAR_POINT;

        for (const [row, col] of STAR_POINTS) {
            const x = BOARD_PADDING + col * CELL_SIZE;
            const y = BOARD_PADDING + row * CELL_SIZE;

            ctx.beginPath();
            ctx.arc(x, y, STAR_POINT_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * 绘制棋子
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @param {number} player - 玩家类型（1=黑棋, 2=白棋）
     */
    drawPiece(row, col, player) {
        const { ctx } = this;
        const { BOARD_PADDING, CELL_SIZE, PIECE_RADIUS, COLORS } = CONFIG;

        // 计算棋子中心坐标
        const x = BOARD_PADDING + col * CELL_SIZE;
        const y = BOARD_PADDING + row * CELL_SIZE;

        // 绘制棋子阴影
        ctx.beginPath();
        ctx.arc(x + 2, y + 2, PIECE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fill();

        // 绘制棋子（使用渐变）
        ctx.beginPath();
        ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);

        // 根据玩家创建渐变
        const gradient = ctx.createRadialGradient(
            x - 5, y - 5, 0,
            x, y, PIECE_RADIUS
        );

        if (player === CONFIG.PLAYER.BLACK) {
            gradient.addColorStop(0, '#555');
            gradient.addColorStop(1, COLORS.BLACK_PIECE);
        } else {
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#ddd');
        }

        ctx.fillStyle = gradient;
        ctx.fill();

        // 绘制最后落子标记
        if (this.lastMoveRow === row && this.lastMoveCol === col) {
            this._drawLastMoveMarker(x, y);
        }
    }

    /**
     * 绘制最后落子标记
     * @param {number} x - 棋子中心 x 坐标
     * @param {number} y - 棋子中心 y 坐标
     * @private
     */
    _drawLastMoveMarker(x, y) {
        const { ctx } = this;
        const { LAST_MOVE_MARKER_RADIUS, COLORS } = CONFIG;

        ctx.beginPath();
        ctx.arc(x, y, LAST_MOVE_MARKER_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.LAST_MOVE_MARKER;
        ctx.fill();
    }

    /**
     * 设置最后落子标记
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     */
    setLastMoveMarker(row, col) {
        this.lastMoveRow = row;
        this.lastMoveCol = col;
    }

    /**
     * 清除最后落子标记
     */
    clearLastMoveMarker() {
        this.lastMoveRow = null;
        this.lastMoveCol = null;
    }

    /**
     * 坐标转换：屏幕坐标 → 棋盘坐标
     * @param {number} x - 屏幕 x 坐标
     * @param {number} y - 屏幕 y 坐标
     * @returns {{row: number, col: number}|null} 棋盘坐标，无效返回 null
     */
    screenToBoard(x, y) {
        const { BOARD_PADDING, CELL_SIZE, CLICK_TOLERANCE, BOARD_SIZE } = CONFIG;

        // 计算最近的交叉点
        const col = Math.round((x - BOARD_PADDING) / CELL_SIZE);
        const row = Math.round((y - BOARD_PADDING) / CELL_SIZE);

        // 检查是否在有效范围内
        if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
            return null;
        }

        // 计算交叉点的实际坐标
        const crossX = BOARD_PADDING + col * CELL_SIZE;
        const crossY = BOARD_PADDING + row * CELL_SIZE;

        // 检查点击是否在交叉点附近（容差范围内）
        const distance = Math.sqrt(Math.pow(x - crossX, 2) + Math.pow(y - crossY, 2));
        if (distance > CLICK_TOLERANCE) {
            return null;
        }

        return { row, col };
    }

    /**
     * 坐标转换：棋盘坐标 → 屏幕坐标
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @returns {{x: number, y: number}} 屏幕坐标
     */
    boardToScreen(row, col) {
        const { BOARD_PADDING, CELL_SIZE } = CONFIG;
        return {
            x: BOARD_PADDING + col * CELL_SIZE,
            y: BOARD_PADDING + row * CELL_SIZE,
        };
    }

    /**
     * 设置点击事件处理器
     * @param {Function} handler - 点击处理函数，接收 (row, col) 参数
     */
    setClickHandler(handler) {
        this.clickHandler = handler;
    }

    /**
     * 清空棋盘
     */
    clear() {
        this.drawBoard();
        this.clearLastMoveMarker();
    }
}
