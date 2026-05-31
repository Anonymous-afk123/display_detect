import React from 'react'

interface SurfaceFlaw {
  category: string
  confidence: number
  coordinates: number[]
}

interface InspectionReport {
  flaw_count: number
  is_accepted: boolean
  grade: number
  flaws: SurfaceFlaw[]
}

interface InspectionResultProps {
  result: {
    marked_image: string
    inspection_result: InspectionReport
  }
}

const DetectionResult: React.FC<InspectionResultProps> = ({ result }) => {
  const { marked_image, inspection_result } = result
  const { flaw_count, is_accepted, grade, flaws } = inspection_result

  const getGradeLabel = (grade: number) => {
    if (grade <= 1) return '优良'
    if (grade <= 3) return '一般'
    return '较差'
  }

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">检测分析结果</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 标注图像 */}
        <div>
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
            标注结果图像
          </h3>
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <img
              src={marked_image}
              alt="检测结果"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* 检测报告 */}
        <div>
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
            检测报告
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <span className="text-slate-600 dark:text-slate-300">异常点数量:</span>
              <span className="font-semibold text-slate-800 dark:text-white">{flaw_count}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <span className="text-slate-600 dark:text-slate-300">评判结论:</span>
              <span className={`font-semibold ${is_accepted ? 'text-success' : 'text-danger'}`}>
                {is_accepted ? '✓ 通过' : '✗ 不通过'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <span className="text-slate-600 dark:text-slate-300">质量等级:</span>
              <span className="font-semibold text-slate-800 dark:text-white">
                {getGradeLabel(grade)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 异常明细 */}
      {flaws.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">
            异常明细
          </h3>
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {flaws.map((flaw, index) => (
                <div key={index} className="p-3 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <div className="font-medium text-slate-800 dark:text-white">
                    异常点 {index + 1}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    类别: {flaw.category}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    可信度: {flaw.confidence.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetectionResult
