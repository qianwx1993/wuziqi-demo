/**
 * 游戏配置模块
 * 提供游戏所需的所有配置常量
 */

/**
 * 游戏配置常量对象
 * @constant {Object}
 */
export const CONFIG = Object.freeze({
    // ========== 棋盘配置 ==========
    /** 棋盘行列数（标准五子棋为 15×15） */
    BOARD_SIZE: 15,

    /** 每个格子的像素大小 */
    CELL_SIZE: 40,

    /** 棋盘边距（像素） */
    BOARD_PADDING: 30,

    // ========== 交互配置 ==========
    /** 点击容差：点击位置距离交叉点多远内有效（像素） */
    CLICK_TOLERANCE: 20,

    // ========== 颜色配置 ==========
    /** 颜色常量 */
    COLORS: Object.freeze({
        /** 页面背景（渐变起色） */
        PAGE_GRADIENT_START: '#667eea',
        /** 页面背景（渐变止色） */
        PAGE_GRADIENT_END: '#764ba2',

        /** 棋盘背景色（木纹色） */
        BOARD_BACKGROUND: '#DEB887',
        /** 网格线颜色（深棕色） */
        GRID_LINE: '#8B4513',
        /** 黑棋颜色 */
        BLACK_PIECE: '#000000',
        /** 白棋颜色 */
        WHITE_PIECE: '#FFFFFF',
        /** 最后落子标记颜色 */
        LAST_MOVE_MARKER: '#FF0000',
        /** 星位点颜色 */
        STAR_POINT: '#8B4513',
        /** 主按钮颜色 */
        BUTTON_PRIMARY: '#667eea',
        /** 按钮悬停颜色 */
        BUTTON_HOVER: '#764ba2',
    }),

    // ========== 玩家枚举 ==========
    /** 玩家类型枚举 */
    PLAYER: Object.freeze({
        /** 空位 */
        EMPTY: 0,
        /** 黑棋（先手） */
        BLACK: 1,
        /** 白棋（后手） */
        WHITE: 2,
    }),

    // ========== 游戏状态枚举 ==========
    /** 游戏状态枚举 */
    GAME_STATE: Object.freeze({
        /** 游戏未开始 */
        IDLE: 'idle',
        /** 游戏进行中 */
        PLAYING: 'playing',
        /** 游戏结束（有胜者） */
        FINISHED: 'finished',
        /** 平局 */
        DRAW: 'draw',
    }),

    // ========== 星位点位置 ==========
    /** 标准五子棋星位点位置（行，列） */
    STAR_POINTS: Object.freeze([
        [3, 3],   // 左上
        [3, 11],  // 右上
        [7, 7],   // 天元（中心）
        [11, 3],  // 左下
        [11, 11], // 右下
    ]),

    // ========== 棋子尺寸 ==========
    /** 棋子半径（像素）= CELL_SIZE/2 - 3 */
    PIECE_RADIUS: 17,

    /** 星位点半径（像素） */
    STAR_POINT_RADIUS: 5,

    /** 最后落子标记半径（像素） */
    LAST_MOVE_MARKER_RADIUS: 4,

    // ========== 胜负判定配置 ==========
    /** 获胜所需的连珠数量 */
    WIN_COUNT: 5,

    // ========== 动画配置 ==========
    /** 落子动画持续时间（毫秒） */
    DROP_ANIMATION_DURATION: 150,

    /** 按钮悬停动画持续时间（毫秒） */
    BUTTON_HOVER_DURATION: 200,

    /** 胜负弹窗动画持续时间（毫秒） */
    WIN_MODAL_DURATION: 300,
});

/**
 * 计算棋盘总尺寸
 * @returns {number} 棋盘总尺寸（像素）
 */
export function getBoardSize() {
    return CONFIG.BOARD_SIZE * CONFIG.CELL_SIZE + CONFIG.BOARD_PADDING * 2;
}

/**
 * 获取玩家显示名称
 * @param {number} player - 玩家类型
 * @returns {string} 玩家显示名称
 */
export function getPlayerName(player) {
    switch (player) {
        case CONFIG.PLAYER.BLACK:
            return '黑棋';
        case CONFIG.PLAYER.WHITE:
            return '白棋';
        default:
            return '未知';
    }
}

/**
 * 获取玩家符号
 * @param {number} player - 玩家类型
 * @returns {string} 玩家符号（● 或 ○）
 */
export function getPlayerSymbol(player) {
    switch (player) {
        case CONFIG.PLAYER.BLACK:
            return '●';
        case CONFIG.PLAYER.WHITE:
            return '○';
        default:
            return '';
    }
}
