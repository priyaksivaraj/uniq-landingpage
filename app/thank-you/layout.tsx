import Script from "next/script"

/**
 * Event snippet for Submit lead form (1) — thank-you page only.
 * Call `gtag_report_conversion(url)` from a link/button when you want conversion + optional redirect.
 */
export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="google-ads-gtag-report-conversion" strategy="afterInteractive">
        {`
function gtag_report_conversion(url) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    if (typeof url !== 'undefined') window.location = url;
    return false;
  }
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  window.gtag('event', 'conversion', {
      'send_to': 'AW-18086645889/i5c5CMqG-Z8cEIGhsbBD',
      'event_callback': callback
  });
  return false;
}
        `}
      </Script>
      {children}
    </>
  )
}
