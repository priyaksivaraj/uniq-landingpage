import Script from "next/script"

/**
 * Google Ads conversion callback (thank-you page only).
 * `gtag` is defined by the global tag in `app/layout.tsx`.
 */
export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="google-ads-conversion-snippet" strategy="afterInteractive">
        {`
function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
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
