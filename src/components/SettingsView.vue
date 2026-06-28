<template>
  <div class="flex-1 overflow-y-auto bg-background">
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-5 px-8 py-8 pb-10">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-primary">设置</p>
          <h1 class="mt-2 font-headline text-3xl font-semibold text-on-surface">偏好设置</h1>
          <p class="mt-2 text-base text-on-surface-variant">管理下载目录、文件命名和登录态文件。</p>
        </div>
        <div v-if="savedMessage" class="max-w-xs rounded-md border border-outline-variant/40 bg-surface-container-lowest px-4 py-2 text-sm leading-6 text-primary shadow-sm">
          {{ savedMessage }}
        </div>
      </div>

      <section class="rounded-lg border border-outline-variant/45 bg-surface-container-lowest shadow-ambient">
        <div class="border-b border-outline-variant/30 p-5">
          <div class="flex items-start justify-between gap-4">
            <div class="flex min-w-0 items-start gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-container-high text-primary">
                <MaterialIcon name="folder" :size="20" />
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-semibold text-on-surface">下载位置</h2>
                <p class="mt-1 text-sm leading-6 text-on-surface-variant">默认目录会跟随当前 macOS 用户自动生成，不会固定在你的电脑用户名下面。</p>
              </div>
            </div>
            <button
              class="h-10 shrink-0 rounded-md border border-outline-variant/40 bg-surface-container-low px-4 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
              @click="resetDownloadDir"
            >
              使用默认
            </button>
          </div>

          <div class="mt-5 flex gap-3">
            <input
              v-model="settings.downloadDir"
              type="text"
              readonly
              class="min-w-0 flex-1 truncate rounded-md border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 font-mono text-sm text-on-surface focus:border-primary focus:outline-none"
            />
            <button
              class="h-11 shrink-0 rounded-md bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-dim"
              @click="selectDownloadDir"
            >
              选择目录
            </button>
          </div>
        </div>

        <div class="border-b border-outline-variant/30 p-5">
          <div class="flex items-start gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-container-high text-primary">
              <MaterialIcon name="drive_file_rename_outline" :size="20" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-base font-semibold text-on-surface">文件名模板</h2>
              <p class="mt-1 text-sm leading-6 text-on-surface-variant">支持标题、ID、上传者变量。</p>
              <input
                v-model="settings.filenameTemplate"
                type="text"
                class="mt-4 w-full rounded-md border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 font-mono text-sm text-on-surface focus:border-primary focus:outline-none"
                placeholder="%(title)s"
              />
              <p class="mt-2 text-sm text-on-surface-variant">可用变量：%(title)s / %(id)s / %(uploader)s</p>
            </div>
          </div>
        </div>

        <div class="border-b border-outline-variant/30 p-5">
          <div class="flex items-start gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-container-high text-primary">
              <MaterialIcon name="high_quality" :size="20" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-base font-semibold text-on-surface">画质偏好</h2>
              <p class="mt-1 text-sm leading-6 text-on-surface-variant">解析后仍可手动选择具体格式。</p>
              <div class="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                <label
                  v-for="quality in qualityOptions"
                  :key="quality.value"
                  class="flex h-10 cursor-pointer items-center justify-center rounded-md border text-sm font-semibold transition-colors"
                  :class="settings.preferredQuality === quality.value ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:text-on-surface'"
                >
                  <input v-model="settings.preferredQuality" type="radio" :value="quality.value" class="hidden" />
                  {{ quality.label }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between gap-4">
            <div class="flex min-w-0 items-start gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-container-high text-primary">
                <MaterialIcon name="key" :size="20" />
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-semibold text-on-surface">Cookies 文件</h2>
                <p class="mt-1 text-sm leading-6 text-on-surface-variant">用于 YouTube、B站、Instagram 等需要登录态的平台。</p>
              </div>
            </div>
            <div class="flex shrink-0 gap-2">
              <button
                v-if="settings.cookiesFile"
                class="h-10 rounded-md border border-outline-variant/40 bg-surface-container-low px-4 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
                @click="clearCookiesFile"
              >
                清除
              </button>
              <button
                class="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-dim"
                @click="selectCookiesFile"
              >
                选择文件
              </button>
            </div>
          </div>
          <input
            v-model="settings.cookiesFile"
            type="text"
            readonly
            placeholder="未选择 cookies.txt"
            class="mt-5 w-full truncate rounded-md border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
          />
        </div>
      </section>

      <button
        class="flex h-12 items-center justify-center gap-2 rounded-md bg-primary text-base font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-dim"
        @click="saveSettings()"
      >
        <MaterialIcon name="save" :size="20" />
        <span>保存设置</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MaterialIcon from './icons/MaterialIcon.vue'

interface Settings {
  downloadDir: string
  filenameTemplate: string
  preferredQuality: string
  cookiesFile: string
}

const settings = ref<Settings>({
  downloadDir: '',
  filenameTemplate: '%(title)s',
  preferredQuality: 'best',
  cookiesFile: '',
})

const savedMessage = ref('')

const qualityOptions = [
  { value: 'best', label: '最佳' },
  { value: '1080p', label: '1080P' },
  { value: '720p', label: '720P' },
  { value: '480p', label: '480P' },
]

async function selectDownloadDir() {
  const dir = await window.electronAPI.dialog.selectFolder()
  if (dir) {
    settings.value.downloadDir = dir
    saveSettings('下载目录已更新')
  }
}

async function resetDownloadDir() {
  settings.value.downloadDir = await window.electronAPI.app.getDefaultDownloadDir()
  saveSettings('已切换到默认目录')
}

async function selectCookiesFile() {
  const file = await window.electronAPI.dialog.selectFile()
  if (file) {
    settings.value.cookiesFile = file
    saveSettings('Cookies 文件已更新')
  }
}

function clearCookiesFile() {
  settings.value.cookiesFile = ''
  saveSettings('Cookies 文件已清除')
}

function saveSettings(message = '设置已保存') {
  localStorage.setItem('settings', JSON.stringify(settings.value))
  savedMessage.value = message
  window.setTimeout(() => {
    savedMessage.value = ''
  }, 1800)
}

async function loadSettings() {
  const saved = localStorage.getItem('settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      settings.value = { ...settings.value, ...parsed }
    } catch {
      localStorage.removeItem('settings')
    }
  }

  if (settings.value.downloadDir) {
    const exists = await window.electronAPI.app.pathExists(settings.value.downloadDir)
    if (!exists) {
      settings.value.downloadDir = await window.electronAPI.app.getDefaultDownloadDir()
      saveSettings('已修复下载目录')
      return
    }
  }

  if (!settings.value.downloadDir) {
    settings.value.downloadDir = await window.electronAPI.app.getDefaultDownloadDir()
  }
}

onMounted(() => {
  loadSettings()
})
</script>
