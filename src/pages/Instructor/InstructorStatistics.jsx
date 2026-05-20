import DashboardLayout from '../../components/layout/DashboardLayout'
import { INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs'
import { useAuth } from '../../context/AuthContext'
import { projects } from '../../data/projects'
import { courses } from '../../data/courses'

// ─── helpers ────────────────────────────────────────────────────────────────
const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

// Build per-course average ratings
const buildRatingData = (instructorId) => {
  const linked = projects.filter(p => p.instructorIds.includes(instructorId) && p.rating > 0)
  const byCourse = {}
  linked.forEach(p => {
    if (!byCourse[p.courseId]) byCourse[p.courseId] = []
    byCourse[p.courseId].push(p.rating)
  })
  return Object.entries(byCourse).map(([courseId, ratings]) => ({
    courseId,
    avg: avg(ratings),
  }))
}

// Compute grade distribution (A ≥ 4.5, B ≥ 3.5, C ≥ 2.5, D ≥ 1.5, F < 1.5)
const buildGradeData = (instructorId) => {
  const rated = projects.filter(p => p.instructorIds.includes(instructorId) && p.rating > 0)
  const counts = { A: 0, B: 0, C: 0, D: 0, F: 0 }
  rated.forEach(p => {
    if      (p.rating >= 4.5) counts.A++
    else if (p.rating >= 3.5) counts.B++
    else if (p.rating >= 2.5) counts.C++
    else if (p.rating >= 1.5) counts.D++
    else                       counts.F++
  })
  const total = rated.length || 1
  return Object.entries(counts).map(([grade, count]) => ({
    grade,
    pct: Math.round((count / total) * 100),
    count,
  }))
}

// ─── Horizontal Bar Chart ────────────────────────────────────────────────────
const RatingsBarChart = ({ data }) => {
  const maxRating = 5
  return (
    <div style={{ width: '100%', height: 300, position: 'relative' }}>
      {/* Grid lines */}
      {[0, 2, 5].map(v => (
        <div
          key={v}
          style={{
            position: 'absolute',
            left: `${17.39 + (v / maxRating) * 82.61}%`,
            top: 0, bottom: '10%',
            borderLeft: '1px dashed #E2E8F0',
          }}
        />
      ))}

      {/* Bars */}
      <div
        style={{
          position: 'absolute',
          left: '17.39%', right: 0,
          top: '9.67%', bottom: '19.67%',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
        }}
      >
        {data.map(({ courseId, avg: rating }) => {
          const course = courses.find(c => c.id === courseId)
          const barWidth = `${(rating / maxRating) * 100}%`
          return (
            <div key={courseId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Course label — right-aligned in left gutter */}
              <div
                style={{
                  position: 'absolute',
                  right: 'calc(82.61% + 8px)',
                  fontSize: 12, fontWeight: 700, color: '#1B2A4A',
                  whiteSpace: 'nowrap',
                }}
              >
                {course?.code ?? courseId}
              </div>
              {/* Bar */}
              <div style={{ flex: 1, height: 20, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    width: barWidth, height: '100%',
                    background: '#00B4A6', borderRadius: 3,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: '#6A7282', minWidth: 24 }}>{rating.toFixed(1)}</span>
            </div>
          )
        })}
      </div>

      {/* X-axis */}
      <div
        style={{
          position: 'absolute',
          left: '17.39%', right: 0,
          top: '90%', bottom: '3.49%',
          borderTop: '1px solid #666',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          paddingTop: 4,
        }}
      >
        {[0, 2, 5].map(v => (
          <span key={v} style={{ fontSize: 12, color: '#64748B' }}>{v}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Pie / Donut Chart ────────────────────────────────────────────────────────
const GRADE_COLORS = {
  A: '#432DD7',
  B: '#00B4A6',
  C: '#F59E0B',
  D: '#EF4444',
  F: '#8B5CF6',
}

const PieChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.pct, 0) || 1
  let cumulative = 0
  const CX = 50, CY = 50, R = 33, INNER = 16

  const slices = data.filter(d => d.pct > 0).map(d => {
    const start = cumulative
    cumulative += (d.pct / total) * 360
    const end = cumulative
    const toRad = (deg) => (deg - 90) * (Math.PI / 180)
    const x1 = CX + R * Math.cos(toRad(start))
    const y1 = CY + R * Math.sin(toRad(start))
    const x2 = CX + R * Math.cos(toRad(end))
    const y2 = CY + R * Math.sin(toRad(end))
    const xi1 = CX + INNER * Math.cos(toRad(start))
    const yi1 = CY + INNER * Math.sin(toRad(start))
    const xi2 = CX + INNER * Math.cos(toRad(end))
    const yi2 = CY + INNER * Math.sin(toRad(end))
    const large = (end - start) > 180 ? 1 : 0
    return {
      ...d,
      path: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${INNER} ${INNER} 0 ${large} 0 ${xi1} ${yi1} Z`,
    }
  })

  return (
    <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
      <svg viewBox='0 0 100 100' style={{ width: 200, height: 200 }}>
        {slices.map(s => (
          <path
            key={s.grade}
            d={s.path}
            fill={GRADE_COLORS[s.grade]}
            stroke='#fff'
            strokeWidth='0.5'
          />
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map(d => (
          <div key={d.grade} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: GRADE_COLORS[d.grade] }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: GRADE_COLORS[d.grade], minWidth: 16 }}>
              {d.grade}
            </span>
            <span style={{ fontSize: 12, color: '#64748B' }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Chart card wrapper ───────────────────────────────────────────────────────
const ChartCard = ({ title, children }) => (
  <div
    style={{
      background: '#FFFFFF',
      border: '0.667px solid #E2E8F0',
      borderRadius: 8,
      boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
      padding: '24.67px',
      flex: 1,
    }}
  >
    <p
      style={{
        fontSize: 14, fontWeight: 700, color: '#1B2A4A',
        letterSpacing: '0.35px', textTransform: 'uppercase',
        marginBottom: 24,
      }}
    >
      {title}
    </p>
    {children}
  </div>
)

// ─── Page ─────────────────────────────────────────────────────────────────────
const InstructorStatistics = () => {
  const { user } = useAuth()
  const ratingData = buildRatingData(user.id)
  const gradeData  = buildGradeData(user.id)

  return (
    <DashboardLayout tabs={INSTRUCTOR_TABS} secondaryTabs={INSTRUCTOR_TABS_SECONDARY}>
      <div className='p-8'>

        {/* Heading */}
        <div className='mb-8'>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', lineHeight: '32px' }}>
            Course Analytics
          </h1>
          <p style={{ fontSize: 14, color: '#6A7282', marginTop: 4 }}>
            Monitor project quality and student performance across your courses.
          </p>
        </div>

        {/* Two chart cards side by side */}
        <div style={{ display: 'flex', gap: 24 }}>
          <ChartCard title='Average Project Ratings by Course'>
            {ratingData.length === 0 ? (
              <div className='flex items-center justify-center h-48'>
                <p style={{ fontSize: 14, color: '#6A7282' }}>No rated projects yet.</p>
              </div>
            ) : (
              <RatingsBarChart data={ratingData} />
            )}
          </ChartCard>

          <ChartCard title='Overall Grade Distribution'>
            {gradeData.every(d => d.pct === 0) ? (
              <div className='flex items-center justify-center h-48'>
                <p style={{ fontSize: 14, color: '#6A7282' }}>No rated projects yet.</p>
              </div>
            ) : (
              <PieChart data={gradeData} />
            )}
          </ChartCard>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default InstructorStatistics