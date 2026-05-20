import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ADMIN_TABS, ADMIN_TABS_SECONDARY } from '../../data/tabs'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

const initialCourses = [
  { id: 1, code: 'CSEN401', name: 'Computer Programming Lab',  instructor: 'Sara Kamel' },
  { id: 2, code: 'CSEN702', name: 'Microprocessors Lab',      instructor: 'Omar Fathy' },
  { id: 3, code: 'CSEN603', name: 'Software Engineering',     instructor: 'Sara Kamel' },
  { id: 4, code: 'DMET501', name: 'Media Engineering Lab',    instructor: 'Nadia Hassan' },
  { id: 5, code: 'BACH',    name: 'Bachelor Project',         instructor: null },
]

const CourseManagement = () => {
  const [courses, setCourses]           = useState(initialCourses)
  const [deletedCourses, setDeletedCourses] = useState([])
  const [showForm, setShowForm]         = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [newCourse, setNewCourse]       = useState({ name: '', code: '' })
  const [activeTab, setActiveTab]       = useState('courses')
  const [confirm, setConfirm]           = useState(null)

  const handleSave = () => {
    if (!newCourse.name || !newCourse.code) { toast.error('Please fill in all fields'); return }
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...newCourse } : c))
      toast.success('Course updated!')
    } else {
      setCourses([...courses, { id: Date.now(), ...newCourse, instructor: null }])
      toast.success('Course created!')
    }
    setShowForm(false); setEditingCourse(null); setNewCourse({ name: '', code: '' })
  }

  const handleDelete = (id) => {
    const course = courses.find(c => c.id === id)
    setCourses(courses.filter(c => c.id !== id))
    setDeletedCourses(prev => [{ ...course, deletedAt: new Date().toLocaleString() }, ...prev])
    setConfirm(null)
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Course <strong>{course.name}</strong> deleted</span>
        <button onClick={() => {
          setCourses(curr => [...curr, course])
          setDeletedCourses(curr => curr.filter(c => c.id !== id))
          toast.dismiss(t.id)
          toast.success('Course restored!')
        }} className="text-indigo-600 font-semibold text-sm underline">Undo</button>
      </div>
    ), { duration: 5000 })
  }

  const restoreCourse = (id) => {
    const course = deletedCourses.find(c => c.id === id)
    const { deletedAt, ...restored } = course
    setCourses(prev => [...prev, restored])
    setDeletedCourses(prev => prev.filter(c => c.id !== id))
    toast.success(`${course.name} restored!`)
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setNewCourse({ name: course.name, code: course.code })
    setShowForm(true)
  }

  const confirmingCourse = confirm ? courses.find(c => c.id === confirm) : null

  return (
    <DashboardLayout tabs={ADMIN_TABS} secondaryTabs={ADMIN_TABS_SECONDARY}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Course Management</h1>
        <p className="text-gray-500 text-sm mb-6">Manage courses and instructor link requests.</p>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'courses',  label: 'Courses' },
            { key: 'deleted',  label: `Deleted (${deletedCourses.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm border ${activeTab === tab.key ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => { setShowForm(!showForm); setEditingCourse(null); setNewCourse({ name: '', code: '' }) }}
                className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
              >
                + Create Course
              </button>
            </div>

            {showForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <h2 className="text-base font-semibold text-gray-700 mb-4">{editingCourse ? 'Edit Course' : 'New Course'}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Course name" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}/>
                  <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Course code e.g. CSEN703" value={newCourse.code} onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}/>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">{editingCourse ? 'Save Changes' : 'Create'}</button>
                  <button onClick={() => { setShowForm(false); setEditingCourse(null) }} className="cursor-pointer border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Course Name</th>
                    <th className="px-5 py-3 font-medium text-center">Code</th>
                    <th className="px-5 py-3 font-medium text-center">Linked Instructor</th>
                    <th className="px-5 py-3 font-medium text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map(course => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{course.name}</td>
                      <td className="px-5 py-3 text-gray-500 text-center">{course.code}</td>
                      <td className="px-5 py-3 text-gray-500 text-center">{course.instructor ?? 'No instructor linked'}</td>
                      <td className="px-5 py-3 flex gap-2 justify-end">
                        <button onClick={() => handleEdit(course)} className="cursor-pointer px-3 py-1 rounded-lg text-xs border border-indigo-200 text-indigo-600 hover:bg-indigo-50">Edit</button>
                        <button onClick={() => setConfirm(course.id)} className="cursor-pointer px-3 py-1 rounded-lg text-xs border border-red-200 text-red-600 hover:bg-red-50">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Deleted Tab */}
        {activeTab === 'deleted' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {deletedCourses.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">No deleted courses</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Course Name</th>
                    <th className="px-5 py-3 font-medium">Code</th>
                    <th className="px-5 py-3 font-medium">Deleted At</th>
                    <th className="px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deletedCourses.map(course => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-400 line-through">{course.name}</td>
                      <td className="px-5 py-3 text-gray-400">{course.code}</td>
                      <td className="px-5 py-3 text-gray-400">{course.deletedAt}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => restoreCourse(course.id)} className="px-3 py-1 rounded-lg text-xs border border-green-200 text-green-600 hover:bg-green-50">Restore</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {confirm && confirmingCourse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Delete Course</h2>
              <button onClick={() => setConfirm(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete <strong>{confirmingCourse.name} ({confirmingCourse.code})</strong>? You can restore it from the Deleted tab.
            </p>
            <div className="flex gap-2">
              <button onClick={() => handleDelete(confirm)} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Delete</button>
              <button onClick={() => setConfirm(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default CourseManagement