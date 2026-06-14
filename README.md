# 生长周记

一个本地优先的个人 DSTE 渐进式网页应用。它把日常口述整理、周重点、任务计时、完成证据和周复盘放进同一条工作流。

## 本地运行

```bash
npm install
npm run dev
```

## 数据与隐私

- 记录保存在浏览器 IndexedDB，不发送到服务器。
- 设置页可以导出和恢复 JSON 备份。
- 清理 Safari 网站数据、删除 PWA 或更换手机前，请先导出备份。
- “复制给 AI”只写入剪贴板，是否粘贴到第三方服务由用户决定。

## 发布到 GitHub Pages

1. 在 GitHub 创建一个公开仓库并推送 `main` 分支。
2. 打开仓库 `Settings > Pages`，将 Source 设为 `GitHub Actions`。
3. 工作流会执行测试、构建并发布 `dist`。

在 iPhone Safari 打开发布地址，使用“分享 > 添加到主屏幕”安装。
