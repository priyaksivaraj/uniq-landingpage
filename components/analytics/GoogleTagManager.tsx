import Script from "next/script"

const GTM_ID_RE = /^GTM-[A-Z0-9]+$/i

function resolveGtmContainerId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GTM_ID?.trim()
  if (!raw || !GTM_ID_RE.test(raw)) return null
  return raw
}

/**
 * Official GTM install (bootstrap + noscript). Renders nothing until `NEXT_PUBLIC_GTM_ID` is set to `GTM-…`.
 */
export default function GoogleTagManager() {
  const id = resolveGtmContainerId()
  if (!id) return null

  const bootstrap = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`

  return (
    <>
      <Script
        id="google-tag-manager-bootstrap"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: bootstrap }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(id)}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  )
}
