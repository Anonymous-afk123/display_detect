from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from app.models.model_loader import SurfaceFlawAnalyzer
from app.utils.image_processor import VisionConverter
import base64
import io
from PIL import Image
import numpy as np

router = APIRouter()
analyzer = SurfaceFlawAnalyzer()
vision_converter = VisionConverter()

@router.post("/inspect")
async def inspect_surface(
    file: UploadFile = File(...),
    sensitivity: float = Form(0.25)
):
    try:
        # 读取图像文件
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # 扫描分析图像
        result = analyzer.scan_surface(image, sensitivity=sensitivity)

        # 处理扫描结果
        marked_image = result["marked_image"]
        inspection_result = result["inspection_result"]

        # 将标注图像转换为 base64
        marked_pil = vision_converter.cv2_to_pil(marked_image)
        buffered = io.BytesIO()
        marked_pil.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        # 构建响应
        response = {
            "marked_image": f"data:image/jpeg;base64,{img_str}",
            "inspection_result": {
                "flaw_count": inspection_result["flaw_count"],
                "is_accepted": inspection_result["is_accepted"],
                "grade": inspection_result["grade"],
                "flaws": inspection_result.get("flaws", [])
            }
        }

        return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"扫描分析失败: {str(e)}")

@router.get("/quality-stats")
async def get_quality_stats():
    try:
        stats = analyzer.get_metrics()
        return JSONResponse(content=stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取指标数据失败: {str(e)}")

@router.post("/reset-session")
async def reset_session():
    try:
        success = analyzer.reset_session()
        return JSONResponse(content={"success": success, "message": "已清除所有检测记录" if success else "清除失败"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"重置失败: {str(e)}")

@router.get("/engine-status")
async def get_engine_status():
    try:
        info = analyzer.get_engine_status()
        return JSONResponse(content=info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取引擎状态失败: {str(e)}")
