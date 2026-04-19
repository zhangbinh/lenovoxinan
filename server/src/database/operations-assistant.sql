-- 运营助手模块数据库表

-- 1. 每日任务表
CREATE TABLE IF NOT EXISTS daily_tasks (
  id SERIAL PRIMARY KEY,
  store_id VARCHAR(100) NOT NULL,
  task_type VARCHAR(50) NOT NULL, -- 任务类型：publish_content(发布内容), interact_comments(互动评论), analyze_data(数据分析)
  task_title VARCHAR(200) NOT NULL,
  task_description TEXT,
  task_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 2, -- 优先级：1-高, 2-中, 3-低
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_daily_tasks_store_id ON daily_tasks(store_id);
CREATE INDEX idx_daily_tasks_task_date ON daily_tasks(task_date);
CREATE INDEX idx_daily_tasks_task_type ON daily_tasks(task_type);

-- 2. 打卡记录表
CREATE TABLE IF NOT EXISTS task_checkins (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL,
  store_id VARCHAR(100) NOT NULL,
  checkin_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES daily_tasks(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_task_checkins_task_id ON task_checkins(task_id);
CREATE INDEX idx_task_checkins_store_id ON task_checkins(store_id);
CREATE INDEX idx_task_checkins_checkin_time ON task_checkins(checkin_time);

-- 3. 周度复盘表
CREATE TABLE IF NOT EXISTS weekly_reviews (
  id SERIAL PRIMARY KEY,
  store_id VARCHAR(100) NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  average_interact_rate DECIMAL(5, 2) DEFAULT 0,
  insights TEXT, -- 本周洞察和建议
  action_plan TEXT, -- 下周行动方案
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(store_id, week_start)
);

-- 创建索引
CREATE INDEX idx_weekly_reviews_store_id ON weekly_reviews(store_id);
CREATE INDEX idx_weekly_reviews_week_start ON weekly_reviews(week_start);

-- 4. 爆款文案模板库表
CREATE TABLE IF NOT EXISTS content_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  platform VARCHAR(50) NOT NULL, -- 平台：xiaohongshu(小红书), douyin(抖音)
  content_type VARCHAR(50) NOT NULL, -- 内容类型：copy(文案), script(脚本)
  title_template TEXT NOT NULL, -- 标题模板
  content_template TEXT NOT NULL, -- 内容模板
  cover_template TEXT, -- 封面建议
  usage_tips TEXT, -- 使用技巧
  tags TEXT[], -- 推荐标签
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_content_templates_platform ON content_templates(platform);
CREATE INDEX idx_content_templates_content_type ON content_templates(content_type);
CREATE INDEX idx_content_templates_is_active ON content_templates(is_active);

-- 插入默认的爆款文案模板
INSERT INTO content_templates (template_name, platform, content_type, title_template, content_template, cover_template, usage_tips, tags) VALUES
('小红书爆款文案模板1', 'xiaohongshu', 'copy', '✨【标题公式】数字+悬念+利益',
'【场景代入】（第1-2句）：描述使用场景，让用户产生代入感
【痛点共鸣】（第3-4句）：指出用户痛点，引发情感共鸣
【产品价值】（第5-7句）：展示产品如何解决问题
【行动引导】（最后1-2句）：引导用户到店或购买

💡 到店转化：在文中加入"到店领礼品/专属价"等优惠钩子',
'【封面】：人+产品+情绪（展示产品使用场景，表情生动）',
'1. 标题使用"数字+悬念+利益"公式，例如："3个技巧让你的XX效率翻倍"
2. 正文结构清晰，使用emoji增加可读性
3. 结尾设置提问，引导用户评论
4. 添加3-5个相关话题标签',
ARRAY['#好物分享', '#真实测评', '#使用心得']),

('小红书爆款文案模板2', 'xiaohongshu', 'copy', '🔥【标题公式】冲突+解决方案+效果',
'【开篇冲突】：提出用户遇到的问题或困惑
【痛点放大】：描述问题带来的困扰
【方案引入】：介绍产品的解决方案
【效果展示】：展示使用后的改变
【行动引导】：引导用户到店体验

💡 到店转化：设置"限时优惠"制造紧迫感',
'【封面】：问题场景+产品解决方案（前后对比）',
'1. 使用"以前vs现在"的对比手法
2. 用具体数据证明效果
3. 添加真实用户反馈截图
4. 强调限时优惠，刺激到店',
ARRAY['#避坑指南', '#好物推荐', '#真实体验']),

('抖音15秒脚本模板', 'douyin', 'script', '【黄金5秒结构】',
'0-3秒（钩子）：冲突/悬念/数字
3-12秒（卖点）：核心卖点展示
12-15秒（引导）：到店引导

💡 到店转化：结尾设置"到店领好礼"行动号召',
'【封面】：强视觉冲击+门店地址',
'1. 前3秒必须抓住注意力
2. 中间快速展示核心卖点
3. 结尾明确引导到店
4. 挂载门店POI地址',
ARRAY['#抖音开店', '#到店引流', '#门店推广']),

('抖音30秒脚本模板', 'douyin', 'script', '【抖音完整结构】',
'0-3秒（钩子）：强钩子设置
3-15秒（卖点）：核心卖点+使用场景
15-27秒（痛点）：痛点解决方案
27-30秒（引导）：到店引导

💡 到店转化：提供"线上预约享专属折扣"',
'【封面】：产品展示+优惠信息',
'1. 开头设置悬念或冲突
2. 中间展示多个使用场景
3. 结尾设置限时优惠
4. 挂载门店POI，引导到店',
ARRAY['#抖音带货', '#本地生活', '#门店引流']);
