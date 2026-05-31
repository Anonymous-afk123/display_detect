from ultralytics import YOLO
import os

class SurfaceFlawAnalyzer:
    def __init__(self, engine_path="best.pt"):
        """
        初始化工业表面缺陷分析器
        :param engine_path: 分析引擎模型路径
        """
        self.engine_path = engine_path
        self.engine = None
        self.load_engine()

        # 检测指标数据
        self.metrics = {
            "total_scans": 0,
            "passed": 0,
            "rejected": 0,
            "total_flaws": 0
        }

    def load_engine(self):
        """
        加载目标检测分析引擎
        """
        try:
            if not os.path.exists(self.engine_path):
                print(f"分析引擎 {self.engine_path} 未找到，正在下载...")
            self.engine = YOLO(self.engine_path)
            print(f"分析引擎 {self.engine_path} 已就绪！")
        except Exception as e:
            print(f"引擎初始化失败: {e}")
            raise

    def scan_surface(self, image, sensitivity=0.25):
        """
        扫描产品表面的质量异常
        :param image: 输入图像 (PIL或CV2格式)
        :param sensitivity: 检测灵敏度阈值
        :return: 扫描分析结果
        """
        try:
            import numpy as np

            # 处理图像格式
            if hasattr(image, 'convert'):
                # PIL图像，转换为RGB（去除Alpha通道）
                image = image.convert('RGB')
                image = np.array(image)

            # 确保图像是3通道
            if len(image.shape) == 2:
                # 灰度图转换为RGB
                image = np.stack([image] * 3, axis=-1)
            elif image.shape[2] == 4:
                # RGBA转换为RGB
                image = image[:, :, :3]

            # 引擎推理
            results = self.engine.predict(image, conf=sensitivity, imgsz=320)

            # 分析推理结果
            flaw_count = len(results[0].boxes)
            is_accepted = flaw_count == 0
            grade = min(flaw_count, 5)

            # 绘制标注结果
            marked_image = results[0].plot()

            # 构建异常点明细列表
            flaws = []
            for box in results[0].boxes:
                flaw = {
                    "category": "surface_flaw",  # 简化处理，实际可以根据类别ID映射
                    "confidence": float(box.conf[0]),
                    "coordinates": box.xyxy[0].tolist()
                }
                flaws.append(flaw)

            inspection_result = {
                "flaw_count": flaw_count,
                "is_accepted": is_accepted,
                "grade": grade,
                "flaws": flaws
            }

            # 更新指标数据
            self.metrics["total_scans"] += 1
            if is_accepted:
                self.metrics["passed"] += 1
            else:
                self.metrics["rejected"] += 1
            self.metrics["total_flaws"] += flaw_count

            return {
                "marked_image": marked_image,
                "inspection_result": inspection_result
            }
        except Exception as e:
            print(f"扫描分析失败: {e}")
            raise

    def get_metrics(self):
        """
        获取质量检测指标
        :return: 指标数据
        """
        # 计算平均异常点数
        avg_flaws = 0.0
        if self.metrics["total_scans"] > 0:
            avg_flaws = self.metrics["total_flaws"] / self.metrics["total_scans"]

        return {
            "total_scans": self.metrics["total_scans"],
            "passed": self.metrics["passed"],
            "rejected": self.metrics["rejected"],
            "avg_flaws": round(avg_flaws, 2)
        }

    def reset_session(self):
        """
        重置所有检测记录
        :return: 重置成功与否
        """
        self.metrics = {
            "total_scans": 0,
            "passed": 0,
            "rejected": 0,
            "total_flaws": 0
        }
        return True

    def get_engine_status(self):
        """
        获取分析引擎状态
        :return: 引擎状态信息
        """
        if self.engine is None:
            return {"status": "待初始化"}

        return {
            "status": "运行中",
            "engine_path": self.engine_path,
            "engine_id": self.engine_path.split("/")[-1]
        }
