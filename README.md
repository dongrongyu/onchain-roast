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

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dongrongyu/onchain-roast&env=HELIUS_API_KEY&envDescription=Get%20your%20free%20API%20key%20at%20helius.xyz)

---

**免责声明**：本项目仅供娱乐，不构成任何投资建议。炒土狗亏钱了别怪我，是你自己选的路。

*Built for Solana Hackathon*
