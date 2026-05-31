import React, { useState } from 'react'
import axios from 'axios'

interface ImageUploadProps {
  onInspection: (result: any) => void
  setLoading: (loading: boolean) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onInspection, setLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [sensitivity, setSensitivity] = useState<number>(0.25)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('sensitivity', sensitivity.toString())

      const response = await axios.post('/api/inspect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      onInspection(response.data)
    } catch (error) {
      console.error('扫描异常:', error)
      alert('扫描分析失败，请重新尝试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 图像上传区域 */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              上传待检图片
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="待检图片预览"
                    className="max-h-64 object-contain mx-auto rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-danger text-white rounded-full p-1 hover:bg-rose-600"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreview(null)
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-primary hover:underline"
                  >
                    点击或拖拽图片到此区域
                  </label>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    支持常见图片格式
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 检测灵敏度设置 */}
          <div className="flex-1 flex flex-col justify-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              检测灵敏度: {sensitivity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>0.1</span>
              <span>0.5</span>
              <span>1.0</span>
            </div>

            <button
              type="submit"
              disabled={!selectedFile}
              className="mt-6 bg-primary hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              执行检测
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ImageUpload
