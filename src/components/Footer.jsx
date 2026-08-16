import { Link } from 'react-router-dom'
import Newsletter from './Newsletter'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <div className="footer-brand-name">ATG Tech Picks</div>
          <p className="footer-brand-blurb">
            Independent, hands-researched picks for laptops, components, peripherals,
            smart home gear, and accessories — curated by Auro Technology Group.
          </p>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <Link to="/affiliate-disclosure">Affiliate Disclosure</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>

        <div className="footer-col">
          <h4>Deal Alerts</h4>
          <Newsletter variant="footer" />
        </div>
      </div>

      <div className="footer-disclosure-note">
        ATG Tech Picks is a participant in the Amazon Services LLC Associates Program, an
        affiliate advertising program designed to provide a means for sites to earn
        advertising fees by advertising and linking to Amazon.com. As an Amazon Associate,
        we earn from qualifying purchases. Product prices and availability are accurate as
        of the date shown on each listing and are subject to change.
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>&copy; {new Date().getFullYear()} Auro Technology Group. All rights reserved.</span>
          <span>store.aurotechgroup.com</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
