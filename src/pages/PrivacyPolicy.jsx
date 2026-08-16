function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: {new Date().getFullYear()}</p>

      <div className="legal-notice">
        Placeholder legal copy — have this reviewed by a lawyer before the site goes
        live, and update it to reflect the exact data you collect (analytics,
        newsletter signups, cookies, etc.).
      </div>

      <h2>Information We Collect</h2>
      <p>
        If you sign up for deal alerts, we collect the email address you provide. We
        may also collect standard analytics data (such as pages visited and general
        location) to understand how visitors use this site.
      </p>

      <h2>How We Use Information</h2>
      <p>
        We use your email address only to send occasional updates about new picks and
        deals. We do not sell your personal information to third parties.
      </p>

      <h2>Amazon Associates &amp; Cookies</h2>
      <p>
        As an Amazon Associate, links on this site may set cookies through Amazon when
        you click through, which Amazon uses in accordance with its own privacy
        policy. We do not have access to or control over Amazon's use of that data.
      </p>

      <h2>Your Choices</h2>
      <p>
        You can unsubscribe from deal alert emails at any time using the link in any
        email we send. To request removal of your data, contact us using the details
        on our <a href="/contact">Contact page</a>.
      </p>
    </div>
  )
}

export default PrivacyPolicy
