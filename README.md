# Lenni's Life Map

这是一个适合直接发布到 GitHub Pages 的静态网站项目，保留了原始页面的视觉设计、图片资源和交互效果，并把原本的单文件页面拆分成了更标准的项目结构。

## 项目结构

```text
.
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  └─ main.js
├─ assets/
│  ├─ audio/
│  │  └─ birthday-theme.mp3
│  └─ images/
├─ archive/
│  └─ index.singlefile.html
├─ .gitignore
└─ .nojekyll
```

## 本地预览

可以直接使用任意静态服务器预览，例如：

```powershell
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 发布到 GitHub Pages

1. 把整个项目推送到 GitHub 仓库。
2. 打开仓库的 `Settings` -> `Pages`。
3. 在 `Build and deployment` 中选择 `Deploy from a branch`。
4. 选择你的主分支，例如 `main`，目录选择 `/ (root)`。
5. 保存后等待 GitHub Pages 完成发布。

## 说明

- 网站入口文件现在是根目录的 `index.html`。
- 原始单文件版本已保存在 `archive/index.singlefile.html`，方便后续对照或回滚。
- 音频已接入页面左下角播放器，并会在进入生日页时尝试开始播放。
