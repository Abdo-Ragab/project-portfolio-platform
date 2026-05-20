import { useRef } from 'react'

const OTPInput = ({ value, onChange }) => {
  const inputs = useRef([])

  const handleChange = (index, char) => {
    if (!/^\d*$/.test(char)) return

    const arr = value.split('')
    arr[index] = char
    const next = arr.join('').padEnd(6, '')
    onChange(next.slice(0, 6))

    if (char && index < 5) {
      inputs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1].focus()
    }
  }

  return (
    <div className='flex gap-3 justify-center'>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type='text'
          inputMode='numeric'
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className='w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-lg outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200'
        />
      ))}
    </div>
  )
}

export default OTPInput