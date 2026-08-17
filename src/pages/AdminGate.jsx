import { useAdminAuth } from '../context/AdminAuthContext'
import AdminLoginForm from '../components/AdminLoginForm'
import MfaEnroll from '../components/MfaEnroll'
import MfaChallenge from '../components/MfaChallenge'
import AdminDashboard from '../components/AdminDashboard'

function AdminGate() {
  const { session, loading, isFullyAuthenticated, needsEnrollment, needsChallenge } =
    useAdminAuth()

  if (loading) {
    return <div className="state-message">Loading...</div>
  }

  if (!session) {
    return <AdminLoginForm />
  }

  if (needsEnrollment) {
    return <MfaEnroll />
  }

  if (needsChallenge) {
    return <MfaChallenge />
  }

  if (isFullyAuthenticated) {
    return <AdminDashboard />
  }

  return <div className="state-message">Unable to verify your session. Try logging in again.</div>
}

export default AdminGate
