/**
 * 五子棋游戏主入口文件
 * 负责初始化游戏、绑定 UI 事件
 */

import { CONFIG, getBoardSize } from './config.js';
import { Board } from './board.js';
import { RuleEngine } from './rules.js';
import { Game } from './game.js';

/**
 * 应用程序类
 * 管理整个应用的初始化和 UI 更新
 */
class App {
    /**
     * 构造函数
     */
    constructor() {
        /** @type {Game|null} 游戏实例 */
        this.game = null;

        /** @type {HTMLElement} 当前玩家显示元素 */
        this.currentPlayerElement = null;

        /** @type {HTMLButtonElement} 重新开始按钮 */
        this.restartButton = null;

        /** @type {HTMLButtonElement} 悔棋按钮 */
        this.undoButton = null;
    }

    /**
     * 初始化应用
     */
    init() {
        // 等待 DOM 加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._setup());
        } else {
            this._setup();
        }
    }

    /**
     * 设置应用
     * @private
     */
    _setup() {
        // 获取 DOM 元素
        const canvas = document.getElementById('gameBoard');
        this.currentPlayerElement = document.getElementById('currentPlayer');
        this.restartButton = document.getElementById('restartBtn');
        this.undoButton = document.getElementById('undoBtn');

        // 验证必要元素存在
        if (!canvas || !this.currentPlayerElement || !this.restartButton || !this.undoButton) {
            console.error('缺少必要的 DOM 元素');
            return;
        }

        // 创建游戏实例
        const board = new Board(canvas);
        const ruleEngine = new RuleEngine();
        this.game = new Game(board, ruleEngine);

        // 绑定 UI 事件
        this._bindEvents();

        // 注册游戏状态监听器
        this.game.onStateChange(this._onStateChange.bind(this));

        // 初始化 UI 状态
        this._updateUI();

        console.log('五子棋游戏初始化完成！');
    }

    /**
     * 绑定 UI 事件
     * @private
     */
    _bindEvents() {
        // 重新开始按钮
        this.restartButton.addEventListener('click', () => {
            this.game.startNewGame();
            this._updateUI();
        });

        // 悔棋按钮
        this.undoButton.addEventListener('click', () => {
            const success = this.game.undoMove();
            if (!success) {
                // 可以添加提示：无法悔棋
                console.log('无法悔棋');
            }
        });
    }

    /**
     * 状态变化回调
     * @param {Object} state - 游戏状态
     * @private
     */
    _onStateChange(state) {
        // 更新当前玩家显示
        if (this.currentPlayerElement) {
            this.currentPlayerElement.textContent = `${state.currentPlayer.symbol} ${state.currentPlayer.name}`;
        }

        // 更新悔棋按钮状态
        if (this.undoButton) {
            this.undoButton.disabled = !state.canUndo;
        }
    }

    /**
     * 更新 UI 显示
     * @private
     */
    _updateUI() {
        // 更新当前玩家
        const playerInfo = this.game.getCurrentPlayerInfo();
        if (this.currentPlayerElement) {
            this.currentPlayerElement.textContent = `${playerInfo.symbol} ${playerInfo.name}`;
        }

        // 更新悔棋按钮状态
        if (this.undoButton) {
            this.undoButton.disabled = !this.game.canUndo();
        }
    }
}

// 创建并初始化应用实例
const app = new App();
app.init();
