# 工业零件表面缺陷智能检测分析平台

## 项目简介

这是一个基于深度学习目标检测的工业零件表面质量智能检测分析平台，能够自动扫描识别工业零件表面的裂纹、凹陷、斑点、异色等外观异常，并给出质量等级评估结果。

### 主要功能

- **表面扫描**：上传零件图片进行外观质量检测
- **质量统计**：查看检测历史和质量指标数据
- **智能分级**：自动判断产品表面质量是否达标
- **结果标注**：实时标注检测到的异常区域
- **参数调节**：可调整检测灵敏度阈值

## 技术栈

- **Python**：后端服务开发语言
- **FastAPI**：RESTful API服务框架
- **深度学习目标检测**：基于YOLO架构的检测引擎
- **React + TypeScript**：前端用户界面
- **Vite**：前端构建工具
- **Tailwind CSS**：界面样式框架
- **OpenCV + PIL**：图像处理与格式转换

## 项目结构

```
├── backend/
│   ├── main.py                    # FastAPI 服务入口
│   ├── requirements.txt           # Python 依赖
│   ├── best.pt                    # 预训练检测引擎权重
│   ├── app/
│   │   ├── __init__.py
│   │   ├── api/
│   │   │   └── routes.py          # API 路由定义
│   │   ├── models/
│   │   │   └── model_loader.py    # 检测引擎加载与推理
│   │   └── utils/
│   │       └── image_processor.py # 图像格式转换工具
│
├── frontend/
│   ├── index.html                 # 前端入口页面
│   ├── package.json               # Node.js 项目配置
│   ├── vite.config.ts             # Vite 构建配置
│   ├── tailwind.config.js         # Tailwind 样式配置
│   └── src/
│       ├── main.tsx               # React 应用入口
│       ├── App.tsx                # 主应用组件
│       ├── index.css              # 全局样式
│       └── components/
│           ├── ImageUpload.tsx     # 图片上传组件
│           ├── DetectionResult.tsx # 检测结果展示组件
│           ├── Statistics.tsx      # 质量统计组件
│           └── SystemInfo.tsx      # 引擎状态组件
│
└── README.md
```

## 安装步骤

### 1. 后端环境

```bash
cd backend
pip install -r requirements.txt
```

### 2. 前端环境

```bash
cd frontend
npm install
```

### 3. 引擎文件

系统使用 `best.pt` 作为默认检测引擎，放置在 `backend/` 目录下。首次启动时若文件不存在，系统会自动下载。

## 使用方法

### 1. 启动后端服务

```bash
cd backend
python main.py
```

后端API服务运行在 `http://localhost:8000`，可通过 `http://localhost:8000/docs` 查看API文档。

### 2. 启动前端界面

```bash
cd frontend
npm run dev
```

### 3. 访问系统

打开浏览器，访问 `http://localhost:3001`

### 4. 检测流程

1. **上传图片**：在"表面扫描"标签页上传待检测的零件图片
2. **调节灵敏度**：根据产品要求拖动灵敏度滑块
3. **执行检测**：点击"执行检测"按钮启动分析
4. **查看报告**：查看标注图像、异常点明细和质量分级

## 检测类型

- **裂纹**：零件表面的线性裂纹或断裂痕迹
- **凹陷**：表面局部压痕或塌陷
- **斑点**：表面污点、氧化斑等点状异常
- **异色**：颜色不均匀或异常变色区域

## 评估标准

- **通过**：无外观异常点（异常数量 = 0）
- **不通过**：存在外观异常点（异常数量 > 0）
- **质量等级**：优良（≤1）、一般（≤3）、较差（>3）

## API接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api` | 服务健康检查 |
| POST | `/api/inspect` | 上传图像并执行表面扫描分析 |
| GET | `/api/quality-stats` | 获取质量检测指标数据 |
| POST | `/api/reset-session` | 重置当前检测会话 |
| GET | `/api/engine-status` | 获取分析引擎运行状态 |

## 故障排除

### 常见问题

1. **引擎下载失败**：检查网络连接，确保能访问模型仓库
2. **检测速度慢**：可调整 `imgsz` 参数降低推理分辨率
3. **检测结果不准确**：可调节灵敏度参数优化检测效果

### 错误处理

- **ModuleNotFoundError**：确保已安装所有依赖
- **FileNotFoundError**：确保引擎权重文件存在
- **Connection Refused**：确保后端服务已启动

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

---

**版本**：2.0.0
**更新日期**：2026-05
