import { useState, useRef, useCallback, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { messages as allMessages } from '../../data/messages'
import { students, instructors, employers } from '../../data/users'
import { ADMIN_TABS, ADMIN_TABS_SECONDARY, STUDENT_TABS, STUDENT_TABS_SECONDARY, EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY, INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs'
import { Send, Paperclip, Image, Film, Mic, User, FileText, Edit, X, Reply, Copy, Smile, Trash, Flag, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const getUserInfo = (userId) => {
  const student = students.find(s => s.id === userId)
  if (student) return { name: `${student.firstName} ${student.lastName}`, role: 'Student', avatar: student.avatar }
  const instructor = instructors.find(i => i.id === userId)
  if (instructor) return { name: `${instructor.firstName} ${instructor.lastName}`, role: 'Instructor', avatar: instructor.avatar }
  const employer = employers.find(e => e.id === userId)
  if (employer) return { name: employer.companyName, role: 'Employer', avatar: employer.avatar }
  return { name: 'Unknown', role: 'User', avatar: 'https://i.pravatar.cc/150?img=1' }
}

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
  if (diff < 604800) {
    const d = Math.floor(diff / 86400)
    return d === 1 ? 'Yesterday' : `${d} days ago`
  }
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

let msgCounter = 100

const MessagesPage = () => {
  const { user } = useAuth()
  const [convos, setConvos] = useState([])
  const [selected, setSelected] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [search, setSearch] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)
  const [newChatSearch, setNewChatSearch] = useState('')
  const [hoveredMsg, setHoveredMsg] = useState(null)
  const [openMenuMsgId, setOpenMenuMsgId] = useState(null)
  const [showAttach, setShowAttach] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const [reactingTo, setReactingTo] = useState(null)
  const [msgReactions, setMsgReactions] = useState({})

  const fileRef = useRef(null)
  const imageRef = useRef(null)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  // Initialize conversations from messages data
  useEffect(() => {
    if (!user?.id) {
      setConvos([])
      setSelected(null)
      return
    }

    // Get all messages for current user (both sent and received)
    const userMessages = allMessages.filter(m => m.senderId === user.id || m.receiverId === user.id)

    // Group messages by conversation
    const conversationMap = {}
    userMessages.forEach(msg => {
      const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId
      if (!conversationMap[otherUserId]) {
        conversationMap[otherUserId] = {
          userId: otherUserId,
          messages: [],
          lastMessageTime: msg.sentAt,
          unread: msg.receiverId === user.id && !msg.read
        }
      }
      conversationMap[otherUserId].messages.push({
        id: msg.id,
        from: msg.senderId === user.id ? 'me' : 'them',
        text: msg.content,
        time: getTimeAgo(msg.sentAt),
        sentAt: msg.sentAt,
        read: msg.read
      })
      // Update last message time
      if (new Date(msg.sentAt) > new Date(conversationMap[otherUserId].lastMessageTime)) {
        conversationMap[otherUserId].lastMessageTime = msg.sentAt
        conversationMap[otherUserId].unread = msg.receiverId === user.id && !msg.read
      }
    })

    // Convert to array and add user info
    const conversations = Object.values(conversationMap).map(conv => {
      const userInfo = getUserInfo(conv.userId)
      return {
        id: conv.userId,
        name: userInfo.name,
        role: userInfo.role,
        roleColor: userInfo.role === 'Instructor' ? 'text-green-600' : userInfo.role === 'Employer' ? 'text-purple-600' : 'text-blue-600',
        avatar: userInfo.avatar,
        time: getTimeAgo(conv.lastMessageTime),
        unread: conv.unread,
        lastMessage: conv.messages[conv.messages.length - 1]?.text || '',
        messages: conv.messages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)),
        userId: conv.userId
      }
    })

    // Sort by last message time (newest first)
    conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
    setConvos(conversations)
    if (conversations.length > 0 && !selected) {
      setSelected(conversations[0])
    }
  }, [user?.id])

  const getTabs = () => {
    if (user?.role === 'admin') return { tabs: ADMIN_TABS, secondary: ADMIN_TABS_SECONDARY }
    if (user?.role === 'instructor') return { tabs: INSTRUCTOR_TABS, secondary: INSTRUCTOR_TABS_SECONDARY }
    if (user?.role === 'employer') return { tabs: EMPLOYER_TABS, secondary: EMPLOYER_TABS_SECONDARY }
    return { tabs: STUDENT_TABS, secondary: STUDENT_TABS_SECONDARY }
  }
  const { tabs, secondary } = getTabs()

  const selectConvo = (c) => {
    setSelected(c)
    setConvos(prev => prev.map(cv => cv.id === c.id ? { ...cv, unread: false } : cv))
  }

  const sendMessage = useCallback((text) => {
    const msgText = text !== undefined ? text : newMessage
    if (!msgText.trim() || !selected) return
    msgCounter += 1
    const msg = {
      id: msgCounter,
      from: 'me',
      text: msgText,
      time: 'Just now',
      sentAt: new Date().toISOString(),
      replyTo: replyTo?.text
    }
    setConvos(prev => prev.map(c => {
      if (c.id === selected.id) {
        const updated = { ...c, messages: [...c.messages, msg], lastMessage: msgText, time: 'Just now' }
        setSelected(updated)
        return updated
      }
      return c
    }))
    setNewMessage('')
    setReplyTo(null)
  }, [newMessage, replyTo, selected])

  const deleteMessage = (msgId) => {
    setConvos(prev => prev.map(c => {
      if (c.id === selected.id) {
        const updated = { ...c, messages: c.messages.filter(m => m.id !== msgId) }
        setSelected(updated)
        return updated
      }
      return c
    }))
    toast.success('Message deleted')
  }

  const startNewChat = (u) => {
    const exists = convos.find(c => c.id === u.id)
    if (exists) { selectConvo(exists); setShowNewChat(false); return }
    const newConvo = {
      id: u.id,
      name: u.role === 'employer' ? u.companyName : `${u.firstName} ${u.lastName}`,
      role: u.role === 'student' ? 'Student' : u.role === 'employer' ? 'Employer' : 'Instructor',
      roleColor: u.role === 'instructor' ? 'text-green-600' : u.role === 'employer' ? 'text-purple-600' : 'text-blue-600',
      avatar: u.avatar,
      time: 'Now',
      unread: false,
      lastMessage: '',
      messages: [],
      userId: u.id
    }
    setConvos(prev => [newConvo, ...prev])
    setSelected(newConvo)
    setShowNewChat(false)
    setNewChatSearch('')
  }

  const handleFile = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      toast.success(`${type} attached: ${file.name}`)
      sendMessage(`📎 ${file.name}`)
    }
    setShowAttach(false)
    e.target.value = ''
  }

  const allUsers = [...students, ...instructors, ...employers].filter(u => u.id !== user?.id)
  const filtered = convos.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  const filteredUsers = allUsers.filter(u => {
    const name = u.role === 'employer' ? u.companyName : `${u.firstName} ${u.lastName}`
    return name.toLowerCase().includes(newChatSearch.toLowerCase())
  })

  return (
    <DashboardLayout tabs={tabs} secondaryTabs={secondary}>
      <div className="flex h-full">

        {/* Left panel — conversation list */}
        <div className="w-72 border-r border-gray-200 flex flex-col bg-white shrink-0">
          <div className="p-3 border-b border-gray-100 flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
              placeholder="Search messages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              onClick={() => setShowNewChat(true)}
              className="cursor-pointer p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              title="New message"
            >
              <Edit size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.map(c => (
              <div
                key={c.id}
                onClick={() => selectConvo(c)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${selected?.id === c.id ? 'bg-indigo-50' : ''}`}
              >
                <img src={c.avatar} className="w-10 h-10 rounded-full shrink-0" alt={c.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm text-gray-800 ${c.unread ? 'font-bold' : 'font-semibold'}`}>{c.name}</p>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
                </div>
                {c.unread && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — chat window */}
        {selected ? (
          <div className="flex-1 flex flex-col">

            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
              <img src={selected.avatar} className="w-10 h-10 rounded-full" alt={selected.name} />
              <div>
                <p className="font-semibold text-gray-800">{selected.name}</p>
                <p className={`text-xs font-medium ${selected.roleColor}`}>{selected.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3 bg-gray-50">
              {selected.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'} group`}
                  onMouseEnter={() => setHoveredMsg(msg.id)}
                  onMouseLeave={() => { setHoveredMsg(null) }}
                >
                  <div className="relative">

                    {/* Dropdown arrow button */}
                    {hoveredMsg === msg.id && (
                      <button
                        onClick={() => setOpenMenuMsgId(openMenuMsgId === msg.id ? null : msg.id)}
                        className={`cursor-pointer absolute -top-3 text-gray-400 hover:text-indigo-600 p-1 bg-white rounded-full border border-gray-200 shadow-sm transition-colors z-10 ${msg.from === 'me' ? '-left-3' : '-right-3'}`}
                        title="Message options"
                      >
                        <ChevronDown size={14} />
                      </button>
                    )}

                    {/* Hover action menu */}
                    {openMenuMsgId === msg.id && (
                      <div className={`absolute top-0 mt-2 ${msg.from === 'me' ? 'right-full' : 'left-full'} z-50`}>
                        <div className={`flex gap-1 bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1 ${msg.from === 'me' ? 'flex-row-reverse' : ''}`}>
                          <button
                            onClick={() => { setReplyTo(msg); setOpenMenuMsgId(null) }}
                            className="text-gray-400 hover:text-indigo-600 p-0.5"
                            title="Reply"
                          >
                            <Reply size={13} />
                          </button>
                          <button
                            onClick={() => { navigator.clipboard.writeText(msg.text); toast.success('Copied!'); setOpenMenuMsgId(null) }}
                            className="text-gray-400 hover:text-indigo-600 p-0.5"
                            title="Copy"
                          >
                            <Copy size={13} />
                          </button>

                          {/* Emoji reaction button */}
                          <div className="relative">
                            <button
                              onClick={() => setReactingTo(reactingTo === msg.id ? null : msg.id)}
                              className="text-gray-400 hover:text-indigo-600 p-0.5"
                              title="React"
                            >
                              <Smile size={13} />
                            </button>
                            {reactingTo === msg.id && (
                              <div className="absolute top-full mb-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg px-2 py-1.5 flex gap-1 z-50">
                                {['❤️', '👍', '😂', '😮', '😢', '🔥'].map(emoji => (
                                  <button
                                    key={emoji}
                                    onClick={() => {
                                      setMsgReactions(prev => ({ ...prev, [msg.id]: emoji }))
                                      setReactingTo(null)
                                      setOpenMenuMsgId(null)
                                    }}
                                    className="text-lg hover:scale-125 transition-transform"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {msg.from === 'me' && (
                            <button
                              onClick={() => { deleteMessage(msg.id); setOpenMenuMsgId(null) }}
                              className="text-gray-400 hover:text-red-500 p-0.5"
                              title="Delete"
                            >
                              <Trash size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => { toast.success('Message reported'); setOpenMenuMsgId(null) }}
                            className="text-gray-400 hover:text-red-500 p-0.5"
                            title="Report"
                          >
                            <Flag size={13} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div>
                      {msg.replyTo && (
                        <div className="text-xs px-3 py-1 mb-1 rounded-lg border-l-2 border-indigo-400 bg-indigo-50 text-gray-500 truncate max-w-xs">
                          ↩ {msg.replyTo}
                        </div>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-sm ${
                        msg.from === 'me'
                          ? 'bg-indigo-600 text-white rounded-br-sm'
                          : 'bg-white border border-gray-200 text-gray-700 rounded-bl-sm'
                      }`}>
                        {msg.text}
                      </div>

                      {/* Reaction display */}
                      {msgReactions[msg.id] && (
                        <div className={`text-xs mt-1 ${msg.from === 'me' ? 'text-right' : 'text-left'}`}>
                          <span className="bg-white border border-gray-200 rounded-full px-2 py-0.5 text-sm shadow-sm cursor-pointer"
                            onClick={() => setMsgReactions(prev => { const n = { ...prev }; delete n[msg.id]; return n })}>
                            {msgReactions[msg.id]}
                          </span>
                        </div>
                      )}

                      <p className={`text-[10px] text-gray-400 mt-0.5 ${msg.from === 'me' ? 'text-right' : ''}`}>{msg.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply preview */}
            {replyTo && (
              <div className="px-6 py-2 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-indigo-600">
                  <Reply size={14} />
                  <span className="truncate max-w-xs">Replying to: {replyTo.text}</span>
                </div>
                <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Input bar */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">

                {/* Attachment */}
                <div className="relative">
                  <button
                    onClick={() => setShowAttach(!showAttach)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Paperclip size={18} />
                  </button>
                  {showAttach && (
                    <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-40">
                      <button onClick={() => fileRef.current.click()} className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-gray-50 text-sm text-gray-700"><FileText size={18} className="text-indigo-500" /> Document</button>
                      <button onClick={() => imageRef.current.click()} className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-gray-50 text-sm text-gray-700"><Image size={18} className="text-indigo-500" /> Photo</button>
                      <button onClick={() => videoRef.current.click()} className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-gray-50 text-sm text-gray-700"><Film size={18} className="text-indigo-500" /> Video</button>
                      <button onClick={() => audioRef.current.click()} className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-gray-50 text-sm text-gray-700"><Mic size={18} className="text-indigo-500" /> Audio</button>
                      <button onClick={() => { toast.success('Contact sharing coming soon!'); setShowAttach(false) }} className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-gray-50 text-sm text-gray-700"><User size={18} className="text-indigo-500" /> Contact</button>
                    </div>
                  )}
                  <input type="file" ref={fileRef} className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={e => handleFile(e, 'Document')} />
                  <input type="file" ref={imageRef} className="hidden" accept="image/*" onChange={e => handleFile(e, 'Photo')} />
                  <input type="file" ref={videoRef} className="hidden" accept="video/*" onChange={e => handleFile(e, 'Video')} />
                  <input type="file" ref={audioRef} className="hidden" accept="audio/*" onChange={e => handleFile(e, 'Audio')} />
                </div>

                <input
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-300"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={() => sendMessage()}
                  className="cursor-pointer bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a conversation
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">New Message</h2>
              <button onClick={() => setShowNewChat(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
              placeholder="Search by name..."
              value={newChatSearch}
              onChange={e => setNewChatSearch(e.target.value)}
              autoFocus
            />
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
              {filteredUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => startNewChat(u)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 text-left"
                >
                  <img src={u.avatar} className="w-9 h-9 rounded-full" alt={u.id} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{u.role === 'employer' ? u.companyName : `${u.firstName} ${u.lastName}`}</p>
                    <p className="text-xs text-gray-400">{u.role === 'student' ? 'Student' : u.role === 'employer' ? 'Employer' : 'Instructor'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default MessagesPage