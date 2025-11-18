import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { getPlans, getRecords } from '../utils/storage'
import type { WorkoutPlan, WorkoutRecord } from '../types/models'

type DayCell = {
  date: dayjs.Dayjs
  isCurrentMonth: boolean
  hasRecord: boolean
}

const RecordsPage = () => {
  const [records] = useState<WorkoutRecord[]>(() => getRecords())
  const [plans] = useState<WorkoutPlan[]>(() => getPlans())
  const [month, setMonth] = useState(dayjs())
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'))

  const recordsByDate = useMemo(() => {
    return records.reduce<Record<string, WorkoutRecord[]>>((map, record) => {
      if (!map[record.date]) map[record.date] = []
      map[record.date].push(record)
      return map
    }, {})
  }, [records])

  const selectedRecords = recordsByDate[selectedDate] ?? []

  const buildCalendar = (): DayCell[] => {
    const startOfMonth = month.startOf('month')
    const startWeekday = startOfMonth.day()
    const daysInMonth = month.daysInMonth()
    const cells: DayCell[] = []

    for (let i = startWeekday - 1; i >= 0; i -= 1) {
      const date = startOfMonth.subtract(i + 1, 'day')
      cells.push({ date, isCurrentMonth: false, hasRecord: Boolean(recordsByDate[date.format('YYYY-MM-DD')]) })
    }

    for (let d = 1; d <= daysInMonth; d += 1) {
      const date = startOfMonth.date(d)
      cells.push({ date, isCurrentMonth: true, hasRecord: Boolean(recordsByDate[date.format('YYYY-MM-DD')]) })
    }

    const total = Math.ceil(cells.length / 7) * 7
    const extra = total - cells.length
    const lastDate = startOfMonth.date(daysInMonth)
    for (let i = 1; i <= extra; i += 1) {
      const date = lastDate.add(i, 'day')
      cells.push({ date, isCurrentMonth: false, hasRecord: Boolean(recordsByDate[date.format('YYYY-MM-DD')]) })
    }

    return cells
  }

  const cells = buildCalendar()

  const formatDateLabel = (dateStr: string) => {
    const d = dayjs(dateStr)
    const recordsForDay = recordsByDate[dateStr] ?? []
    const planNames = recordsForDay
      .map((r) => r.planName || plans.find((p) => p.id === r.planId)?.name)
      .filter(Boolean)
    return `${d.format('M月D日')} · ${planNames.join(' / ')}`
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary-light">训练记录</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonth((m) => m.subtract(1, 'month'))}
            className="rounded-full p-2 text-text-secondary-light transition hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <p className="text-sm font-semibold text-text-primary-light">{month.format('YYYY年MM月')}</p>
          <button
            onClick={() => setMonth((m) => m.add(1, 'month'))}
            className="rounded-full p-2 text-text-secondary-light transition hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm text-text-secondary-light">
        {['日', '一', '二', '三', '四', '五', '六'].map((wd) => (
          <div key={wd} className="py-2 font-medium">
            {wd}
          </div>
        ))}
        {cells.map((cell) => {
          const dateKey = cell.date.format('YYYY-MM-DD')
          const isSelected = dateKey === selectedDate
          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDate(dateKey)}
              className={`
                flex h-12 items-center justify-center rounded-lg border text-sm transition
                ${cell.isCurrentMonth ? 'bg-white text-text-primary-light' : 'bg-gray-50 text-gray-400'}
                ${cell.hasRecord ? 'border-primary/60' : 'border-gray-200'}
                ${isSelected ? 'ring-2 ring-primary' : ''}
              `}
            >
              <span
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full
                  ${cell.hasRecord ? 'bg-primary/10 text-primary' : ''}
                `}
              >
                {cell.date.date()}
              </span>
            </button>
          )
        })}
      </div>

      <div className="space-y-2 rounded-xl bg-white p-4 shadow-card">
        <p className="text-sm font-semibold text-text-primary-light">当天完成的训练</p>
        {selectedRecords.length ? (
          selectedRecords.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-text-primary-light">
                  {r.planName || plans.find((p) => p.id === r.planId)?.name || '训练计划'}
                </p>
                <p className="text-xs text-text-secondary-light">{formatDateLabel(r.date)}</p>
              </div>
              <span className="material-symbols-outlined text-primary">check_circle</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-secondary-light">当天暂无记录</p>
        )}
      </div>
    </div>
  )
}

export default RecordsPage
