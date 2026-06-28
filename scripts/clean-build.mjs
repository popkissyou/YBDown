import { rmSync } from 'node:fs'
import { resolve } from 'node:path'

for (const dir of ['dist', 'dist-electron']) {
  rmSync(resolve(dir), { recursive: true, force: true })
}
