import { Link } from 'react-router-dom'

function DisclosureBanner() {
  return (
    <div className="disclosure-banner">
      As an Amazon Associate, we earn from qualifying purchases.{' '}
      <Link to="/affiliate-disclosure">Learn more</Link>
    </div>
  )
}

export default DisclosureBanner
