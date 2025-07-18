  "use client"

  import { useEffect, useState } from "react"
  import { useSelector } from "react-redux"
  import { MdEmail, MdAccessTime, MdCheckCircle, MdCancel, MdSend } from "react-icons/md"
  import { Link } from 'react-router-dom'
  import {Base_URL} from '../Api/Base'

  function AllTrackedEmails() {
    const { token } = useSelector((state) => state.auth)
    const [trackings, setTrackings] = useState([])
    const [loading, setLoading] = useState(true)
    const handleSync = async () => {
    setLoading(true);
    try {
      await fetch(`${Base_URL}/sync-status`, {
        method: 'POST',
        credentials: 'include'
      });
      // Optionally, refresh list after sync
      fetchTrackings();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setLoading(false);
    }
  };


  const fetchTrackings = async () => {
    try {
      const res = await fetch("http://localhost:5000/trackings", {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch trackings")
      const data = await res.json()
      setTrackings(data)
    } catch (err) {
      console.error("Tracking fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrackings()
  }, [token])


    const getStatusBadge = (status) => {
      const statusConfig = {
        sent: {
          icon: <MdSend className="w-3 h-3" />,
          text: "Sent",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        },
        responded: {
          icon: <MdCheckCircle className="w-3 h-3" />,
          text: "Responded",
          className: "bg-green-100 text-green-800 border-green-200",
        },
        ghosted: {
          icon: <MdCancel className="w-3 h-3" />,
          text: "Ghosted",
          className: "bg-red-100 text-red-800 border-red-200",
        },
      }

      const config = statusConfig[status] || {
        icon: <MdAccessTime className="w-3 h-3" />,
        text: status,
        className: "bg-gray-100 text-gray-800 border-gray-200",
      }

      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}
        >
          {config.icon}
          {config.text}
        </span>
      )
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    if (loading) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tracked emails...</p>
            </div>
          </div>
        </div>
      )
    }

    if (trackings.length === 0) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-8 text-center">
              <MdEmail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tracked emails yet</h3>
              <p className="text-gray-600">Start tracking your emails to see them here.</p>
            </div>
          </div>
        </div>
      )
    }

    return (

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div> <Link to='/' className="bg-blue-600 p-3 px-4 rounded-2xl">Home</Link></div>
              <button
                onClick={handleSync}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
              >
                🔄 Sync Status
              </button>
              <MdEmail className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Tracked Emails</h2>
              <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                {trackings.length} {trackings.length === 1 ? "email" : "emails"}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {trackings.map((tracking) => (
              <div key={tracking._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{tracking.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      To: <span className="font-medium">{tracking.to}</span>
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">{getStatusBadge(tracking.status)}</div>
                </div>

                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MdAccessTime className="w-3 h-3" />
                    <span>Sent {formatDate(tracking.sentAt)}</span>
                  </div>

                  {tracking.responseReceivedAt && (
                    <div className="flex items-center gap-1">
                      <MdCheckCircle className="w-3 h-3 text-green-600" />
                      <span>Replied {formatDate(tracking.responseReceivedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  export default AllTrackedEmails
