import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const images = [
  ['shheben-20-50.jpg', 'shheben-20-50.webp'],
  ['shheben-10-20.jpg', 'shheben-10-20.webp'],
  ['kroshka-5-10.jpg', 'kroshka-5-10.webp'],
  ['muka-0-0-2.jpg', 'muka-0-0-2.webp'],
  ['0-1 mm.jpg', 'kroshka-0-1.webp'],
  ['1,0-1,5-mm-RU.jpg', 'kroshka-1-0-1-5.webp'],
  ['1,5-2,0-RU.jpg', 'kroshka-1-5-2-0.webp'],
  ['2,0-3,0-mm-RU.jpg', 'kroshka-2-3.webp'],
  ['2-500-мкм-RU.jpg', 'mikrokaltsit-5-200.webp'],
]

const sourceDir = path.resolve('public/images/products')
const outputDir = path.join(sourceDir, 'optimized')

await mkdir(outputDir, { recursive: true })

for (const [sourceName, outputName] of images) {
  const source = path.join(sourceDir, sourceName)
  const output = path.join(outputDir, outputName)

  await sharp(source)
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 78, effort: 5 })
    .toFile(output)

  const metadata = await sharp(output).metadata()
  console.log(`${outputName}: ${metadata.width}x${metadata.height}`)
}
