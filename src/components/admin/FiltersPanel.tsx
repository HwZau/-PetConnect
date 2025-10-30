import { useMemo, useState, type ReactNode } from 'react'
import { AiOutlineCalendar, AiOutlineFilter, AiOutlineSearch } from 'react-icons/ai'

type FieldOption = { value: string; label: string }

type Field<T> = {
  key: keyof T
  label: string
  type?: 'select' | 'text' | 'date' | 'number'
  options?: FieldOption[]
  placeholder?: string
  /** mark field as advanced (hidden until expanded) */
  advanced?: boolean
  /** optional icon to show inside the control */
  icon?: ReactNode
}

interface FiltersPanelProps<T extends Record<string, any>> {
  fields: Array<Field<T>>
  values: T
  onChange: (next: T) => void
  onReset?: () => void
  className?: string
}
function FiltersPanel<T extends Record<string, any>>({ fields, values, onChange, onReset, className = '' }: FiltersPanelProps<T>) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const basicFields = useMemo(() => fields.filter(f => !f.advanced), [fields])
  const advancedFields = useMemo(() => fields.filter(f => f.advanced), [fields])

  const handleChange = (key: keyof T, v: any) => {
    onChange({ ...(values as any), [String(key)]: v } as T)
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-4 sm:p-5 mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bộ Lọc</h3>
        {advancedFields.length > 0 && (
          <button
            aria-expanded={showAdvanced}
            className="text-sm text-gray-600 flex items-center gap-2 hover:text-gray-800 transition-colors"
            onClick={() => setShowAdvanced(s => !s)}
          >
            <span className="hidden sm:inline">{showAdvanced ? 'Ẩn nâng cao' : 'Hiện nâng cao'}</span>
            <svg className={`w-4 h-4 transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l5 5a1 1 0 11-1.414 1.414L10 5.414 5.707 9.707A1 1 0 114.293 8.293l5-5A1 1 0 0110 3z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Single-row horizontal filters: each field gets flex-1 and a min width so they distribute evenly.
          Overflow-x allows scrolling on very small screens instead of wrapping. */}
      <div className="flex gap-3 mt-3 overflow-x-auto">
        {basicFields.map((f) => (
          <div key={String(f.key)} className="flex flex-col min-w-[200px] flex-1">
            <label className="text-sm text-gray-600 mb-1">{f.label}</label>
            {f.type === 'select' ? (
              <div className="relative">
                {/** left icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {f.icon ?? <AiOutlineFilter />}
                </div>
                <select
                  value={(values as any)[f.key] ?? 'All'}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="appearance-none w-full rounded-xl pl-9 pr-8 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500 truncate whitespace-nowrap"
                >
                  <option value="All">Tất cả</option>
                  {(f.options || []).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M6 8l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            ) : f.type === 'date' ? (
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {f.icon ?? <AiOutlineCalendar />}
                </div>
                <input
                  type="date"
                  value={(values as any)[f.key] ?? ''}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="w-full rounded-xl pl-9 px-3 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {f.icon ?? <AiOutlineSearch />}
                </div>
                <input
                  type="text"
                  placeholder={f.placeholder ?? ''}
                  value={(values as any)[f.key] ?? ''}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="w-full rounded-xl pl-9 px-3 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500 truncate"
                />
              </div>
            )}
          </div>
        ))}

        <div className={`col-span-1 sm:col-span-2 md:col-span-2 overflow-hidden`}>
          <div className={`transform transition-all duration-300 ${showAdvanced ? 'opacity-100 translate-y-0 max-h-[800px] mt-3' : 'opacity-0 -translate-y-2 max-h-0'}`}>
            <div className="flex gap-3">
              {advancedFields.map((f) => (
                <div key={String(f.key)} className="flex flex-col min-w-[200px] flex-1">
                  <label className="text-sm text-gray-600 mb-1">{f.label}</label>
                  {f.type === 'select' ? (
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {f.icon ?? <AiOutlineFilter />}
                      </div>
                      <select
                        value={(values as any)[f.key] ?? 'All'}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                        className="appearance-none w-full rounded-xl pl-9 pr-8 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500 truncate whitespace-nowrap"
                      >
                        <option value="All">Tất cả</option>
                        {(f.options || []).map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M6 8l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  ) : f.type === 'date' ? (
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {f.icon ?? <AiOutlineCalendar />}
                      </div>
                      <input
                        type="date"
                        value={(values as any)[f.key] ?? ''}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                        className="w-full rounded-xl pl-9 px-3 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {f.icon ?? <AiOutlineSearch />}
                      </div>
                      <input
                        type="text"
                        placeholder={f.placeholder ?? ''}
                        value={(values as any)[f.key] ?? ''}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                        className="w-full rounded-xl pl-9 px-3 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500 truncate"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2 md:col-span-2 flex items-center gap-2 justify-end mt-2">
          <button
            onClick={() => { onReset?.(); }}
            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Đặt Lại
          </button>
        </div>
      </div>
    </div>
  )
}

export default FiltersPanel
