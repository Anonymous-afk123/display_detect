import React, { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import DetectionResult from './components/DetectionResult'
import Statistics from './components/Statistics'
import SystemInfo from './components/SystemInfo'

function App() {
  const [activeTab, setActiveTab] = useState('inspect')
  const [inspectionResult, setInspectionResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleInspection = (result: any) => {
    setInspectionResult(result)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 头部 */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
            工业零件表面缺陷智能检测分析平台
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            AI驱动的表面缺陷自动化识别与分级评估
          </p>
        </header>

        {/* 标签页导航 */}
        <div className="flex justify-center mb-8 bg-white dark:bg-slate-800 rounded-lg shadow-md p-1">
          <button
            className={`px-6 py-2 rounded-md font-medium ${activeTab === 'inspect' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            onClick={() => setActiveTab('inspect')}
          >
            表面扫描
          </button>
          <button
            className={`px-6 py-2 rounded-md font-medium ${activeTab === 'statistics' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            onClick={() => setActiveTab('statistics')}
          >
            质量统计
          </button>
          <button
            className={`px-6 py-2 rounded-md font-medium ${activeTab === 'system' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            onClick={() => setActiveTab('system')}
          >
            引擎状态
          </button>
        </div>

        {/* 内容区域 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          {activeTab === 'inspect' && (
            <div className="space-y-6">
              <ImageUpload onInspection={handleInspection} setLoading={setLoading} />
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}
              {inspectionResult && (
                <DetectionResult result={inspectionResult} />
              )}
            </div>
          )}

          {activeTab === 'statistics' && (
            <Statistics />
          )}

          {activeTab === 'system' && (
            <SystemInfo />
          )}
        </div>

        {/* 底部 */}
        <footer className="mt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
          <p>© 2026 表面缺陷智能检测分析平台 | 基于深度学习目标检测</p>
        </footer>
      </div>
    </div>
  )
}

export default App
