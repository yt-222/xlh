import { defineConfig } from 'astro/config';

// 部署在子路径时（GitHub Pages 的 https://用户名.github.io/仓库名/）
// 由部署流程传入 BASE_PATH，本地开发时不传则默认根路径
const base = process.env.BASE_PATH || '/';

// 站点地址，用于生成绝对链接；部署流程会自动传入
const site = process.env.SITE_URL || 'https://example.com';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
