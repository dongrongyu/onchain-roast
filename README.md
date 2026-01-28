# OnChain Roast

**你的 Solana 钱包毒舌分析师**

想知道自己炒币有多"韭"吗？OnChain Roast 会分析你的 Solana 钱包链上交易记录，然后毫不留情地嘲讽你。没有安慰，没有滤镜，只有赤裸裸的真相和扎心的吐槽。

## 功能特色

输入你的 Solana 钱包地址，立即获得：

- **Degen 指数 (0-100)** - 你到底有多"赌狗"？
- **人格称号** - "钻石手传奇" 还是 "专业接盘侠"？
- **交易统计** - 胜率、盈亏、持仓时间、踩雷次数
- **成就徽章** - 解锁 "夜猫子"、"周末战士"、"纸手" 等徽章
- **专属吐槽** - 根据你的真实交易行为生成的毒舌点评

## 效果预览

```
+------------------------------------------+
|            你的 DEGEN 指数                |
|                                          |
|              🔥 87 🔥                     |
|            "完全疯狂模式"                  |
|                                          |
|  胜率: 21%       |    踩雷: 37 次         |
|  平均持仓: 1分钟  |    总盈亏: -$69.52     |
|                                          |
|  "你收集的土狗比宠物店还多，                |
|   真是个合格的 Rug Collector。"           |
+------------------------------------------+
```

## 技术栈

- **Next.js 16** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS 4** - 样式
- **Helius API** - Solana 交易数据
- **Jupiter API** - 代币价格

## 快速开始

### 前置要求

- Node.js 18+
- Helius API Key（免费申请：[helius.xyz](https://helius.xyz)）

### 安装运行

```bash
# 克隆仓库
git clone https://github.com/dongrongyu/onchain-roast.git
cd onchain-roast

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，填入你的 HELIUS_API_KEY

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)，开始被嘲讽吧。

### 生产构建

```bash
npm run build
npm run start
```

## 工作原理

1. **获取交易记录** - 通过 Helius API 拉取你的 DEX 交易历史
2. **分析交易数据** - 计算胜率、盈亏、持仓时间、踩雷次数
3. **计算 Degen 指数** - 基于以下因素加权计算：
   - 胜率（越低越 degen）
   - 踩雷数量
   - 土狗币交易占比
   - 深夜/周末交易频率
   - 交易频率
4. **生成吐槽文案** - 根据你的交易特征生成专属毒舌点评

## 支持的 DEX

- Jupiter (v4 & v6)
- Raydium (AMM & CLMM)
- Orca (Whirlpool & v1)
- Serum DEX

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dongrongyu/onchain-roast&env=HELIUS_API_KEY&envDescription=Get%20your%20free%20API%20key%20at%20helius.xyz)

或手动部署：

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 添加环境变量 `HELIUS_API_KEY`
4. 点击部署

## 贡献

欢迎 PR。如果你能让吐槽更毒，那就更好了。

## 许可证

MIT

---

**免责声明**：本项目仅供娱乐，不构成任何投资建议。炒土狗亏钱了别怪我，是你自己选的路。

*Built for Solana Hackathon*
