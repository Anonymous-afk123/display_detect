import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface EngineStatus {
  status: string
  engine_path: string
  engine_id: string
}

const SystemInfo: React.FC = () => {
  const [engineStatus, setEngineStatus] = useState<EngineStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchEngineStatus = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/engine-status')
      setEngineStatus(response.data)
    } catch (error) {
      console.error('获取引擎状态失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEngineStatus()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">引擎状态</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 引擎信息 */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
            引擎信息
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-600">
              <span className="text-slate-600 dark:text-slate-300">运行状态:</span>
              <span className={`font-semibold ${engineStatus?.status === '运行中' ? 'text-success' : 'text-danger'}`}>
                {engineStatus?.status || '未知'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-600">
              <span className="text-slate-600 dark:text-slate-300">引擎路径:</span>
              <span className="font-semibold text-slate-800 dark:text-white text-sm">
                {engineStatus?.engine_path || '未知'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3">
              <span className="text-slate-600 dark:text-slate-300">引擎标识:</span>
              <span className="font-semibold text-slate-800 dark:text-white">
                {engineStatus?.engine_id || '未知'}
              </span>
            </div>
          </div>
          <button
            onClick={fetchEngineStatus}
            className="mt-4 bg-primary hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            刷新状态
          </button>
        </div>

        {/* 平台说明 */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
            平台说明
          </h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300">
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>检测类型：裂纹、凹陷、斑点、异色</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>引擎：目标检测网络 (v8)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>灵敏度：可调节，默认为0.25</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>结果保存：自动保存到本地存储</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <span>API接口：http://localhost:8000/api</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SystemInfo
