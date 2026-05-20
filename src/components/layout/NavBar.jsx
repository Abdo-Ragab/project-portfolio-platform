import { Bell, BellOff, Code, MessageSquare } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { notifications as allNotifications } from '../../data/notifications'
import { messages as allMessages } from '../../data/messages'
import { students, instructors, employers } from '../../data/users'

const getTimeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) {
    const m = Math.floor(diff / 60)
    return `${m} min${m !== 1 ? 's' : ''} ago`
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600)
    return `${h} hour${h !== 1 ? 's' : ''} ago`
  }
  const d = Math.floor(diff / 86400)
  return d === 1 ? '1 day ago' : `${d} days ago`
}

const getUserInfo = (userId) => {
  const student = students.find(s => s.id === userId)
  if (student) return { name: `${student.firstName} ${student.lastName}`, avatar: student.avatar }
  const instructor = instructors.find(i => i.id === userId)
  if (instructor) return { name: `${instructor.firstName} ${instructor.lastName}`, avatar: instructor.avatar }
  const employer = employers.find(e => e.id === userId)
  if (employer) return { name: employer.companyName, avatar: employer.avatar }
  return { name: 'Unknown', avatar: 'https://i.pravatar.cc/150?img=1' }
}

const NavBar = ({ isNotifications }) => {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages]           = useState(false)
  const [notifications, setNotifications]         = useState([])
  const [messages, setMessages]                   = useState([])
  const [notificationsDisabled, setNotificationsDisabled] = useState(user?.notificationsEnabled === false)

  const notifRef = useRef(null)
  const msgRef   = useRef(null)

  // Check if notifications are disabled
  useEffect(() => {
    if (!user?.id) return
    const storageKey = `notifications_enabled_${user.id}`
    const persisted = localStorage.getItem(storageKey)
    const isEnabled = persisted !== 'false'
    setNotificationsDisabled(!isEnabled)
    updateUser({ notificationsEnabled: isEnabled })
  }, [user?.id])

  // Load and filter notifications and messages for current user
  useEffect(() => {
    if (!user?.id) {
      setNotifications([])
      setMessages([])
      return
    }

    // Filter and format notifications for current user
    const userNotifs = allNotifications
      .filter(n => n.userId === user.id)
      .map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        read: n.read,
        time: getTimeAgo(n.createdAt),
        icon: n.type === 'invitation' ? '👥' : n.type === 'feedback' ? '💬' : n.type === 'internship' ? '💼' : n.type === 'system' ? '✓' : n.type === 'deadline' ? '⏰' : n.type === 'flag' ? '🚩' : n.type === 'message' ? '✉️' : '📢',
        link: n.type === 'message' ? '/messages' : '/notifications',
        type: n.type
      }))
    setNotifications(userNotifs)

    // Filter and format messages for current user (both sent and received) and group by conversation
    const userMsgs = allMessages
      .filter(m => m.senderId === user.id || m.receiverId === user.id)
    
    // Group messages by conversation partner
    const conversationMap = {}
    userMsgs.forEach(m => {
      const isReceived = m.receiverId === user.id
      const otherUserId = isReceived ? m.senderId : m.receiverId
      const userInfo = getUserInfo(otherUserId)
      
      if (!conversationMap[otherUserId]) {
        conversationMap[otherUserId] = {
          id: otherUserId,
          from: userInfo.name,
          avatar: userInfo.avatar,
          messages: [],
          read: true,
          time: '',
          lastMessageTime: new Date(0)
        }
      }
      conversationMap[otherUserId].messages.push(m)
    })
    
    // Get latest message from each conversation
    const conversations = Object.values(conversationMap).map(conv => {
      const sorted = conv.messages.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
      const latest = sorted[0]
      return {
        ...conv,
        message: latest.content,
        read: latest.read,
        time: getTimeAgo(latest.sentAt),
        lastMessageTime: new Date(latest.sentAt)
      }
    }).sort((a, b) => b.lastMessageTime - a.lastMessageTime)
    
    setMessages(conversations)
  }, [user?.id])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false)
      if (msgRef.current   && !msgRef.current.contains(e.target))   setShowMessages(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const unreadNotifs   = notifications.filter(n => !n.read).length
  const unreadMessages = messages.filter(m => !m.read).length

  const markNotifRead    = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  const markAllNotifsRead = ()  => setNotifications(notifications.map(n => ({ ...n, read: true })))
  const markMsgRead      = (id) => setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m))

  const activeClassName   = 'pt-6 pb-[21px] text-[#432DD7] text-sm font-bold border-b-3 border-[#432DD7] transition-colors duration-150'
  const inactiveClassName = 'py-6 text-[#6A7282] text-sm hover:text-[#432DD7] transition-colors duration-150'

  const getDashboardPath = () => {
    if (!user) return '/'
    if (user.role === 'admin')      return '/admin/dashboard'
    if (user.role === 'student')    return '/student/dashboard'
    if (user.role === 'employer')   return '/employer/dashboard'
    if (user.role === 'instructor') return '/instructor/dashboard'
    return '/'
  }

  return (
    <nav className='flex items-center bg-white justify-between border-b border-[#E2E8F0] relative z-50'>
      <NavLink className='flex items-center ml-6' to='/'>
        <Code className='text-[#432DD7] w-6 h-6'/>
        <span className='text-navy text-lg font-bold ml-2'>GUC Hub</span>
      </NavLink>

      <div className='flex gap-8'>
        <NavLink className={({ isActive }) => isActive ? activeClassName : inactiveClassName} to='/projects'>Projects</NavLink>
        <NavLink className={({ isActive }) => isActive ? activeClassName : inactiveClassName} to='/portfolios'>Portfolios</NavLink>
        <NavLink className={({ isActive }) => isActive ? activeClassName : inactiveClassName} to='/instructors'>Instructors</NavLink>
        {user?.role === 'student' && (
          <NavLink className={({ isActive }) => isActive ? activeClassName : inactiveClassName} to='/student/internships'>Internships</NavLink>
        )}
      </div>

      <div className='flex items-center mr-6 gap-5'>

        {/* Bell icon */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false) }}
            className={`cursor-pointer relative transition-colors ${
              location.pathname === '/notifications' 
                ? 'text-[#432DD7] border-b-2 border-[#432DD7] pb-1' 
                : 'text-[#6A7282] hover:text-[#432DD7]'
            }`}
          >
            {notificationsDisabled ? (
              <BellOff className='w-5 h-5' />
            ) : (
              <Bell className='w-5 h-5' />
            )}
            {notificationsDisabled || unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadNotifs}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800 text-sm">Notifications</p>
                <button
                  onClick={markAllNotifsRead}
                  disabled={unreadNotifs === 0}
                  className={`cursor-pointer text-xs font-medium ${
                    unreadNotifs === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-indigo-600 hover:underline'
                  }`}
                >
                  Mark all as read
                </button>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 ${!n.read ? 'bg-indigo-50/40' : ''}`}
                  >
                    <span
                      className="text-lg mt-0.5 cursor-pointer"
                      onClick={() => { markNotifRead(n.id); setShowNotifications(false); navigate(n.link) }}
                    >
                      {n.icon}
                    </span>
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => { markNotifRead(n.id); setShowNotifications(false); navigate(n.link) }}
                    >
                      <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                      <p className="text-xs text-gray-500 truncate">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500"/>}
                      <div className="flex items-center gap-1">
                        {!n.read && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markNotifRead(n.id) }}
                            className="text-[10px] text-indigo-500 hover:underline whitespace-nowrap"
                          >
                            Mark read
                          </button>
                        )}
                        {n.read && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setNotifications(notifications.map(x => x.id === n.id ? { ...x, read: false } : x)) }}
                            className="text-[10px] text-gray-400 hover:text-indigo-500 hover:underline whitespace-nowrap"
                          >
                            Mark unread
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button
                  onClick={() => { setShowNotifications(false); navigate('/notifications') }}
                  className="cursor-pointer text-xs text-indigo-600 hover:underline w-full text-center"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message icon */}
        <div className="relative" ref={msgRef}>
          <button
            onClick={() => { setShowMessages(!showMessages); setShowNotifications(false) }}
            className={`cursor-pointer relative transition-colors ${
              location.pathname === '/messages' 
                ? 'text-[#432DD7] border-b-2 border-[#432DD7] pb-1' 
                : 'text-[#6A7282] hover:text-[#432DD7]'
            }`}
          >
            <MessageSquare className='w-5 h-5' />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadMessages}
              </span>
            )}
          </button>

          {showMessages && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800 text-sm">Messages</p>
                <button
                  onClick={() => { setShowMessages(false); navigate('/messages') }}
                  className="cursor-pointer text-xs text-indigo-600 hover:underline"
                >
                  New message +
                </button>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {messages.map(m => (
                  <div
                    key={m.id}
                    onClick={() => { markMsgRead(m.id); setShowMessages(false); navigate('/messages') }}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${!m.read ? 'bg-indigo-50/40' : ''}`}
                  >
                    <img src={m.avatar} className="w-8 h-8 rounded-full shrink-0" alt={m.from} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800">{m.from}</p>
                      <p className="text-xs text-gray-500 truncate">{m.message}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{m.time}</p>
                    </div>
                    {!m.read && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1 shrink-0"/>}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button
                  onClick={() => { setShowMessages(false); navigate('/messages') }}
                  className="cursor-pointer text-xs text-indigo-600 hover:underline w-full text-center"
                >
                  View all messages →
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='h-8 w-px bg-[#E2E8F0]' />

          {user && (
              <div className="flex">
                    <div className='flex flex-col mr-2 items-end'>
                        <span className='text-sm font-semibold text-navy'>{user.role === 'employer' ? user.companyName :  user.role === 'admin' ? user.email : user.firstName + ' ' + user.lastName}</span>
                        <span className={`w-fit rounded-full text-[10px] px-1.5 py-0.5 ${
                          user.role == 'student' ? 'text-[#1447E6] bg-[#DBEAFE]' :
                          user.role == 'instructor' ? 'text-[#008236] bg-[#DCFCE7]' :
                          user.role == 'employer' ? 'text-[#8200DB] bg-[#F3E8FF]' :
                          'text-[#C10007] bg-[#FFE2E2]'
                        }`}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                    </div>
                    <img src={user.avatar} alt="Profile" className="size-8 rounded-full" />
              </div>
          )}
        </div>
    </nav>
  )
}

export default NavBar