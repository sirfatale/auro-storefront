function AffiliateDisclosure() {
  return (
    <div className="legal-page">
      <h1>Affiliate Disclosure</h1>
      <p className="legal-updated">Last updated: {new Date().getFullYear()}</p>

      <div className="legal-notice">
        Placeholder legal copy — have this reviewed by a lawyer before the site goes
        live, to make sure it satisfies FTC and Amazon Associates disclosure
        requirements.
      </div>

      <p>
        ATG Tech Picks is a participant in the Amazon Services LLC Associates Program,
        an affiliate advertising program designed to provide a means for sites to earn
        advertising fees by advertising and linking to Amazon.com and affiliated sites.
      </p>

      <h2>What This Means</h2>
      <p>
        When you click a "View on Amazon" link or button on this site and make a
        qualifying purchase, we may earn a small commission at no additional cost to
        you. This helps support the research and upkeep of this site.
      </p>

      <h2>Our Editorial Independence</h2>
      <p>
        Product selection is based on our own research and criteria. Earning a
        commission does not influence which products we choose to feature or how we
        describe them.
      </p>

      <h2>Pricing &amp; Availability</h2>
      <p>
        Prices, ratings, and availability shown on this site are provided for
        reference only and are accurate as of the date noted on each listing. Amazon
        prices and stock levels change frequently — always confirm the current price
        and details on Amazon before purchasing.
      </p>

      <h2>Questions</h2>
      <p>
        If you have questions about this disclosure, please visit our{' '}
        <a href="/contact">Contact page</a>.
      </p>
    </div>
  )
}

export default AffiliateDisclosure
