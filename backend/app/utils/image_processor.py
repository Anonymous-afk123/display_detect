import cv2
import numpy as np
from PIL import Image

class VisionConverter:
    def __init__(self):
        """
        初始化视觉格式转换器
        """
        pass

    def pil_to_cv2(self, image):
        """
        将PIL图像转换为OpenCV格式
        :param image: PIL图像
        :return: OpenCV图像 (BGR)
        """
        if hasattr(image, 'convert'):
            return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        return image

    def cv2_to_pil(self, image):
        """
        将OpenCV图像转换为PIL格式
        :param image: OpenCV图像 (BGR)
        :return: PIL图像 (RGB)
        """
        if len(image.shape) == 3:
            return Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        return Image.fromarray(image)

    def preprocess_image(self, image):
        """
        图像预处理（尺寸调整、归一化等）
        :param image: 输入图像
        :return: 预处理后的图像
        """
        # 预留预处理扩展点，如自适应直方图均衡、降噪等
        return image

    def draw_annotations(self, image, results):
        """
        在图像上绘制检测标注框
        :param image: 原始图像
        :param results: 推理结果
        :return: 标注后的图像
        """
        # 使用YOLO内置可视化方法
        return results[0].plot()
