import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface QualityStatsData {
  total_scans: number
  passed: number
  rejected: number
  avg_flaws: number
}

const Statistics: React.FC = () => {
  const [qualityData, setQualityData] = useState<QualityStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string>('')

  const fetchQualityStats = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/quality-stats')
      setQualityData(response.data)
    } catch (error) {
      console.error('获取指标数据失败:', error)
      setMessage('获取指标数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSession = async () => {
    try {
      const response = await axios.post('/api/reset-session')
      setMessage(response.data.message)
      fetchQualityStats()
    } catch (error) {
      console.error('重置数据失败:', error)
      setMessage('重置数据失败')
    }
  }

  useEffect(() => {
    fetchQualityStats()
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
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">质量统计</h2>

      {message && (
        <div className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
            检测记录
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-600">
              <span className="text-slate-600 dark:text-slate-300">总检测批次:</span>
              <span className="font-semibold text-slate-800 dark:text-white">
                {qualityData?.total_scans || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-600">
              <span className="text-slate-600 dark:text-slate-300">通过批次:</span>
              <span className="font-semibold text-success">
                {qualityData?.passed || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-600">
              <span className="text-slate-600 dark:text-slate-300">退回批次:</span>
              <span className="font-semibold text-danger">
                {qualityData?.rejected || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3">
              <span className="text-slate-600 dark:text-slate-300">平均异常数:</span>
              <span className="font-semibold text-slate-800 dark:text-white">
                {(qualityData?.avg_flaws || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
            数据管理
          </h3>
          <button
            onClick={fetchQualityStats}
            className="bg-primary hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg transition-colors mb-4 w-full"
          >
            更新记录
          </button>
          <button
            onClick={handleResetSession}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium py-3 px-6 rounded-lg transition-colors w-full"
          >
            重置数据
          </button>
        </div>
      </div>
    </div>
  )
}

export default Statistics
