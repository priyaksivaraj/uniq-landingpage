import Script from "next/script"

/** Google Ads measurement ID (site-wide Google tag). */
const GOOGLE_ADS_ID = "AW-18086645889"

/**
 * Google tag (gtag.js) — load on every page per Google Ads install instructions.
 */
export default function GoogleAdsGtag() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  )
}
