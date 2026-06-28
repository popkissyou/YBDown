import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

// 暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 剪贴板
  clipboard: {
    readText: () => ipcRenderer.invoke('clipboard:readText'),
    writeText: (text: string) => ipcRenderer.invoke('clipboard:writeText', text),
  },
  
  // 对话框
  dialog: {
    selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
    selectFile: () => ipcRenderer.invoke('dialog:selectFile'),
  },
  
  // 应用
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getDefaultDownloadDir: () => ipcRenderer.invoke('app:getDefaultDownloadDir'),
    pathExists: (filePath: string) => ipcRenderer.invoke('app:pathExists', filePath),
    fetchImage: (url: string, referer?: string) => ipcRenderer.invoke('app:fetchImage', url, referer),
  },
  
  // 系统操作
  shell: {
    openPath: (filePath: string) => ipcRenderer.invoke('shell:openPath', filePath),
    showItemInFolder: (filePath: string) => ipcRenderer.invoke('shell:showItemInFolder', filePath),
    openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),
  },
  
  // YT-DLP 操作
  ytdlp: {
    parse: (url: string, cookiesFile?: string) => ipcRenderer.invoke('ytdlp:parse', url, cookiesFile),
    download: (options: { url: string; formatId: string; outputDir: string; filename?: string; taskId: string; directUrl?: string; cookiesFile?: string; downloadMode?: 'video' | 'audio'; audioTrack?: any; subtitles?: string[] }) => 
      ipcRenderer.invoke('ytdlp:download', options),
    pauseDownload: (taskId: string) => ipcRenderer.invoke('ytdlp:pauseDownload', taskId),
  },
  
  // 下载进度监听
  onDownloadProgress: (callback: (data: any) => void) => {
    const handler = (_: any, data: any) => callback(data)
    ipcRenderer.on('download:progress', handler)
    return () => {
      ipcRenderer.off('download:progress', handler)
    }
  },
  onProcessLog: (callback: (data: any) => void) => {
    const handler = (_: any, data: any) => callback(data)
    ipcRenderer.on('process:log', handler)
    return () => {
      ipcRenderer.off('process:log', handler)
    }
  },
  
  // 历史记录
  history: {
    get: () => ipcRenderer.invoke('history:get'),
    add: (record: any) => ipcRenderer.invoke('history:add', record),
    delete: (id: string) => ipcRenderer.invoke('history:delete', id),
    onUpdated: (callback: (history: any[]) => void) => {
      const handler = (_: any, data: any[]) => callback(data)
      ipcRenderer.on('history:updated', handler)
      return () => {
        ipcRenderer.off('history:updated', handler)
      }
    },
  },
  
  // 更新检查
  checkForUpdates: () => ipcRenderer.invoke('app:checkForUpdates'),
  
  // 菜单事件监听
  onMenuShowAbout: (callback: () => void) => {
    const handler = () => callback()
    ipcRenderer.on('menu:showAbout', handler)
    return () => {
      ipcRenderer.off('menu:showAbout', handler)
    }
  },
})
