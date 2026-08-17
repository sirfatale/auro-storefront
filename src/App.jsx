import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import DisclosureBanner from './components/DisclosureBanner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Contact from './pages/Contact'
import AffiliateDisclosure from './pages/AffiliateDisclosure'
import PrivacyPolicy from './pages/PrivacyPolicy'
import AdminGate from './pages/AdminGate'
import { ADMIN_PATH } from './utils/adminPath'

function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <DisclosureBanner />
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path={ADMIN_PATH} element={<AdminGate />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <Footer />
      </AdminAuthProvider>
    </ThemeProvider>
  )
}

export default App
