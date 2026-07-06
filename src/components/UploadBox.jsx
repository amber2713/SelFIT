import React, { useState, useRef } from 'react'

const UploadBox = ({ onImageSelected }) => {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      onImageSelected(event.target.result) // 返回 base64
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const onButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div 
      className={`upload-box ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        className="file-input-hidden" 
        style={{ display: 'none' }}
        accept="image/*"
        capture="user" // 移动端优化：提示直接调用相机/相册
        onChange={handleChange}
      />
      <div className="upload-icon">📸</div>
      <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
        Drag & Drop your silhouette photo
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        Supports JPEG, PNG. Mobile will open camera or library automatically.
      </p>
    </div>
  )
}

export default UploadBox