import { ImageResponse } from 'next/og';

export const alt = 'ContextMatic - AI Content Repurposing Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', background: 'rgba(24, 24, 27, 0.8)', borderRadius: '24px', border: '1px solid #3f3f46' }}>
          <h1
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: 'white',
              marginBottom: 10,
              letterSpacing: '-0.05em',
            }}
          >
            ContextMatic
          </h1>
          <p
            style={{
              fontSize: 40,
              color: '#a1a1aa',
              marginTop: 0,
            }}
          >
            Create a week of content in 10 minutes.
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
