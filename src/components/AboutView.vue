<template>
  <div class="flex-1 overflow-y-auto bg-background">
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-5 px-8 py-8 pb-10">
      <section class="rounded-lg border border-outline-variant/45 bg-surface-container-lowest p-6 shadow-ambient">
        <div class="flex items-start justify-between gap-5">
          <div class="min-w-0">
            <p class="text-sm font-medium text-primary">关于</p>
            <h1 class="mt-2 font-headline text-3xl font-semibold tracking-tight text-on-surface">YBDown</h1>
            <p class="mt-3 max-w-2xl text-base leading-7 text-on-surface-variant">
              一个面向 macOS 的本地视频解析与下载工具。核心能力基于 yt-dlp、FFmpeg 和本地运行时，重点放在可控的解析、下载和排错过程。
            </p>
          </div>
          <button
            class="flex h-10 min-w-[118px] shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-dim disabled:opacity-60"
            :disabled="checkingUpdate"
            @click="checkUpdate"
          >
            <MaterialIcon :name="checkingUpdate ? 'sync' : 'update'" :size="17" :class="{ 'animate-spin': checkingUpdate }" />
            <span class="whitespace-nowrap">{{ checkingUpdate ? '检测中' : '检测更新' }}</span>
          </button>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <div class="rounded-md border border-outline-variant/30 bg-surface-container-low px-4 py-3">
            <p class="text-sm text-on-surface-variant">版本</p>
            <p class="mt-1 font-mono text-base font-semibold text-on-surface">v{{ displayVersion }}</p>
          </div>
          <div class="rounded-md border border-outline-variant/30 bg-surface-container-low px-4 py-3">
            <p class="text-sm text-on-surface-variant">运行方式</p>
            <p class="mt-1 text-base font-semibold text-on-surface">本地处理</p>
          </div>
          <div class="rounded-md border border-outline-variant/30 bg-surface-container-low px-4 py-3">
            <p class="text-sm text-on-surface-variant">协议</p>
            <p class="mt-1 text-base font-semibold text-on-surface">MIT</p>
          </div>
        </div>

        <div v-if="updateMessage" class="mt-5 rounded-md border border-outline-variant/35 bg-surface-container-low p-3.5">
          <div class="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <div class="flex min-w-0 items-start gap-2 text-sm leading-6" :class="updateMessageClass">
              <MaterialIcon :name="isLatest ? 'check_circle' : 'info'" :size="18" class="mt-0.5 shrink-0" />
              <span class="min-w-0 break-words">{{ updateMessage }}</span>
            </div>
            <button
              v-if="downloadUrl && !isLatest"
              class="flex h-9 shrink-0 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-semibold text-on-primary hover:bg-primary-dim"
              @click="openExternal(downloadUrl)"
            >
              <MaterialIcon name="download" :size="16" />
              <span>前往下载</span>
            </button>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          class="group rounded-lg border border-outline-variant/45 bg-surface-container-lowest p-4 text-left shadow-sm transition-colors hover:bg-surface-container-low"
          @click="openExternal(githubUrl)"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-container-high text-on-surface">
                <MaterialIcon name="code" :size="20" />
              </div>
              <div class="min-w-0">
                <p class="text-base font-semibold text-on-surface">GitHub</p>
                <p class="mt-0.5 truncate text-sm text-on-surface-variant">github.com/popkissyou/YBDown</p>
              </div>
            </div>
            <MaterialIcon name="arrow_forward" :size="17" class="shrink-0 text-on-surface-variant transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>

        <button
          class="group rounded-lg border border-outline-variant/45 bg-surface-container-lowest p-4 text-left shadow-sm transition-colors hover:bg-surface-container-low"
          @click="openExternal(`${githubUrl}/issues`)"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-container-high text-on-surface">
                <MaterialIcon name="feedback" :size="20" />
              </div>
              <div class="min-w-0">
                <p class="text-base font-semibold text-on-surface">问题反馈</p>
                <p class="mt-0.5 truncate text-sm text-on-surface-variant">提交建议或报告问题</p>
              </div>
            </div>
            <MaterialIcon name="arrow_forward" :size="17" class="shrink-0 text-on-surface-variant transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>
      </section>

      <section class="rounded-lg border border-outline-variant/45 bg-surface-container-lowest p-5 shadow-sm">
        <div class="flex items-start gap-5">
          <div class="rounded-md border border-outline-variant/40 bg-white p-2">
            <img :src="qrImage" alt="赞赏二维码" class="size-32 rounded-sm object-cover" />
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="text-base font-semibold text-on-surface">请作者喝杯咖啡</h2>
            <p class="mt-2 text-sm leading-6 text-on-surface-variant">
              如果 YBDown 对你有帮助，觉得这个小工具还不错，可以扫码请作者喝一杯咖啡。感谢你的支持。
            </p>
          </div>
        </div>
      </section>

      <section class="rounded-lg border border-outline-variant/45 bg-surface-container-low p-5">
        <div class="flex items-start gap-3">
          <MaterialIcon name="privacy_tip" :size="20" class="mt-0.5 shrink-0 text-primary" />
          <div>
            <h2 class="text-base font-semibold text-on-surface">隐私说明</h2>
            <p class="mt-2 text-sm leading-6 text-on-surface-variant">
              下载和解析在本机完成。Cookie 文件只在你主动选择后传给本地 yt-dlp 使用，不会通过界面上传到远端服务器。
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MaterialIcon from './icons/MaterialIcon.vue'
import qrImage from '../assets/yb-qr.png'

const githubUrl = 'https://github.com/popkissyou/YBDown'
const appVersion = ref('1.0.0')
const displayVersion = computed(() => formatVersion(appVersion.value))
const isLatest = ref(true)
const checkingUpdate = ref(false)
const updateMessage = ref('')
const updateMessageClass = ref('')
const latestVersion = ref('')
const releaseNotes = ref('')
const downloadUrl = ref('')

function formatVersion(version: string) {
  return version.replace(/\.0$/, '')
}

onMounted(async () => {
  try {
    const version = await window.electronAPI?.app?.getVersion?.()
    if (version) appVersion.value = version
  } catch (error) {
    console.error('获取版本号失败:', error)
  }
})

async function checkUpdate() {
  checkingUpdate.value = true
  updateMessage.value = ''
  downloadUrl.value = ''

  try {
    const result = await window.electronAPI?.checkForUpdates?.()

    if (result?.error) {
      isLatest.value = true
      updateMessage.value = '检测失败：' + result.error
      updateMessageClass.value = 'text-error'
    } else if (result?.hasUpdate) {
      isLatest.value = false
      latestVersion.value = result.version || ''
      releaseNotes.value = result.releaseNotes || ''
      downloadUrl.value = result.downloadUrl || ''
      updateMessage.value = `发现新版本 v${formatVersion(result.version || '')}`
      updateMessageClass.value = 'text-primary'
    } else {
      isLatest.value = true
      appVersion.value = result?.currentVersion || '1.0.0'
      updateMessage.value = '当前已是最新版本 v' + formatVersion(appVersion.value)
      updateMessageClass.value = 'text-primary'
    }
  } catch (error) {
    isLatest.value = true
    updateMessage.value = '检测失败，请检查网络连接'
    updateMessageClass.value = 'text-error'
  } finally {
    checkingUpdate.value = false
  }
}

async function openExternal(url: string) {
  try {
    await window.electronAPI.shell.openExternal(url)
  } catch {
  }
}
</script>
