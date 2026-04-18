import { ImageResponse } from 'next/og'
import fs from 'node:fs'
import path from 'node:path'

export const alt = 'Мраморная крошка и щебень от ЗАО АМП ИМПОРТ-ЭКСПОРТ'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const bgPath = path.join(process.cwd(), 'public/images/products/shheben-20-50.jpg')
  const bgBase64 = fs.readFileSync(bgPath).toString('base64')
  const bgSrc = `data:image/jpeg;base64,${bgBase64}`

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <img
          src={bgSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,20,40,0.15) 0%, rgba(10,20,40,0.55) 60%, rgba(10,20,40,0.85) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 60,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'white',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            display: 'flex',
          }}
        >
          ЗАО АМП ИМПОРТ-ЭКСПОРТ
        </div>
        <div
          style={{
            position: 'relative',
            padding: '0 60px 56px 60px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1,
              textShadow: '0 4px 16px rgba(0,0,0,0.55)',
              display: 'flex',
            }}
          >
            Мраморная крошка и щебень
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 500,
              opacity: 0.95,
              textShadow: '0 2px 10px rgba(0,0,0,0.55)',
              display: 'flex',
            }}
          >
            Белизна 98% · Доставка по России · от 2 900 ₽/т
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 30,
              fontWeight: 700,
              color: '#ffd166',
              textShadow: '0 2px 10px rgba(0,0,0,0.55)',
              display: 'flex',
            }}
          >
            +7 (919) 393-19-92 · amp-minerals.ru
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
