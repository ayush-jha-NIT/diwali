import { ImageResponse } from "next/og";

export const alt = "The Last Spark: Someone left a little magic for you tonight.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** A share-preview that intentionally does not reveal KUHU. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "linear-gradient(125deg, #090b20 0%, #241639 54%, #0c1027 100%)",
        color: "#fff1d7",
        position: "relative",
        overflow: "hidden",
        alignItems: "center",
      }}>
        <div style={{
          display: "flex", position: "absolute", left: 28, right: 28, top: 28, bottom: 28,
          border: "1px solid rgba(246,200,130,.35)", borderRadius: 22,
        }}/>
        <div style={{
          position: "absolute", left: 105, top: 87, display: "flex", gap: 18,
          alignItems: "center", fontSize: 18, fontWeight: 700, letterSpacing: 6, color: "#f8d19b",
        }}>
          <svg width="29" height="29" viewBox="0 0 29 29" fill="none">
            <path d="M14.5 0L17.3 11.7L29 14.5L17.3 17.3L14.5 29L11.7 17.3L0 14.5L11.7 11.7L14.5 0Z" fill="#f4c46e"/>
          </svg>
          THE LAST SPARK
        </div>
        <div style={{
          display: "flex", flexDirection: "column", position: "absolute",
          left: 100, top: 183, width: 720,
        }}>
          <span style={{fontSize: 19, letterSpacing: 5, color: "#efbfc4", marginBottom: 24}}>
            A LITTLE DIWALI MAGIC
          </span>
          <span style={{
            display: "flex", fontSize: 70, lineHeight: 1.05, fontWeight: 600,
            color: "#fff2df", letterSpacing: -3,
          }}>Someone left</span>
          <span style={{
            display: "flex", fontSize: 82, lineHeight: 1.08, fontWeight: 600,
            color: "#f4c46e", letterSpacing: -3,
          }}>a little magic</span>
          <span style={{
            display: "flex", fontSize: 68, lineHeight: 1.1, fontWeight: 600,
            color: "#fff2df", letterSpacing: -3,
          }}>for you tonight.</span>
          <span style={{
            fontSize: 19, marginTop: 35, color: "#e0c6d1",
            letterSpacing: 2, fontWeight: 400,
          }}>OPEN THE INVITATION TO BEGIN</span>
        </div>
        <svg style={{position: "absolute", right: 75, top: 120}} width="310" height="385" viewBox="0 0 310 385">
          <defs>
            <radialGradient id="halo"><stop stopColor="#f4c46e" stopOpacity=".52"/><stop offset="1" stopColor="#f4c46e" stopOpacity="0"/></radialGradient>
            <linearGradient id="bowl" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#ffe4a1"/><stop offset=".48" stopColor="#ce8644"/><stop offset="1" stopColor="#76334d"/>
            </linearGradient>
            <linearGradient id="flame" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#fffbe8"/><stop offset=".5" stopColor="#ffce6a"/><stop offset="1" stopColor="#e97843"/>
            </linearGradient>
          </defs>
          <circle cx="155" cy="196" r="151" fill="url(#halo)"/>
          <circle cx="155" cy="196" r="124" fill="none" stroke="#f3ca90" strokeOpacity=".30" strokeWidth="1"/>
          <circle cx="155" cy="196" r="107" fill="none" stroke="#f3ca90" strokeOpacity=".20" strokeWidth="1" strokeDasharray="4 9"/>
          <path d="M155 78C178 117 192 144 178 169C165 191 139 193 125 171C103 140 139 126 155 78Z" fill="url(#flame)"/>
          <path d="M154 130C163 152 166 165 152 174C142 174 139 165 154 130Z" fill="#fff8de"/>
          <path d="M62 198C70 228 107 257 155 257C203 257 240 228 248 198Z" fill="url(#bowl)" stroke="#ffe1ab" strokeWidth="2"/>
          <ellipse cx="155" cy="198" rx="95" ry="19" fill="#b46b43" stroke="#ffe0a7" strokeWidth="3"/>
          <path d="M91 231Q155 263 219 231" fill="none" stroke="#ffe5ad" strokeOpacity=".55" strokeWidth="3"/>
          <ellipse cx="155" cy="294" rx="110" ry="18" fill="#f4c46e" fillOpacity=".14"/>
        </svg>
        <div style={{
          position: "absolute", left: 98, bottom: 55, fontSize: 15,
          color: "#bca5c8", letterSpacing: 4,
        }}>ONE INVITATION · SEVEN MAGICAL MOMENTS</div>
      </div>
    ),
    size,
  );
}
