import { useMemo, useState, type ReactNode } from 'react'
import { useSettings } from '../../contexts/SettingsContext'
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

interface FiltersPanelProps<T extends Record<string, unknown>> {
  fields: Array<Field<T>>
  values: T
  onChange: (next: T) => void
  onReset?: () => void
  className?: string
}
function FiltersPanel<T extends Record<string, unknown>>({ fields, values, onChange, onReset, className = '' }: FiltersPanelProps<T>) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { theme } = useSettings()

  const basicFields = useMemo(() => fields.filter(f => !f.advanced), [fields])
  const advancedFields = useMemo(() => fields.filter(f => f.advanced), [fields])

  // Use unknown-based accessors to avoid explicit `any`. We accept `v` as unknown and
  // cast back to T when calling onChange (safe as caller controls types of values).
  const handleChange = <K extends keyof T>(key: K, v: unknown) => {
    const base = values as unknown as Record<string, unknown>
    const next = { ...(base as Record<string, unknown>), [String(key)]: v } as unknown as T
    onChange(next)
  }

  const getVal = (key: keyof T) => (values as unknown as Record<string, unknown>)[String(key)];

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} rounded-2xl shadow-xl p-4 sm:p-5 mb-8 ${className}`}>
      <div className="flex items-center justify-between">
  <h3 className="text-lg font-semibold">Bộ Lọc</h3>
        {advancedFields.length > 0 && (
            <button
            aria-expanded={showAdvanced}
            className={`${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-sm text-gray-600 hover:text-gray-800'} flex items-center gap-2 transition-colors`}
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
            <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-sm text-gray-600'} mb-1`}>{f.label}</label>
            {f.type === 'select' ? (
              <div className="relative">
                {/** left icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {f.icon ?? <AiOutlineFilter />}
                </div>
                <select
                  value={(() => {
                    const curr = getVal(f.key);
                    return typeof curr === 'undefined' || curr === null ? 'All' : String(curr);
                  })()}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className={`${theme === 'dark' ? 'appearance-none w-full rounded-xl pl-9 pr-8 py-2 bg-gray-700 text-sm border border-gray-600 focus:ring-green-500 focus:border-green-500 truncate whitespace-nowrap' : 'appearance-none w-full rounded-xl pl-9 pr-8 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500 truncate whitespace-nowrap'}`}
                >
                  <option value="All">{t('Tất cả','All')}</option>
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
                      value={String(getVal(f.key) ?? '')}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className={`${theme === 'dark' ? 'w-full rounded-xl pl-9 px-3 py-2 bg-gray-700 text-sm border border-gray-600 focus:ring-green-500 focus:border-green-500' : 'w-full rounded-xl pl-9 px-3 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500'}`}
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
                    value={String(getVal(f.key) ?? '')}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    className={`${theme === 'dark' ? 'w-full rounded-xl pl-9 px-3 py-2 bg-gray-700 text-sm border border-gray-600 focus:ring-green-500 focus:border-green-500 truncate' : 'w-full rounded-xl pl-9 px-3 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500 truncate'}`}
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
                  <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-sm text-gray-600'} mb-1`}>{f.label}</label>
                  {f.type === 'select' ? (
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {f.icon ?? <AiOutlineFilter />}
                      </div>
                      <select
                        value={(() => { const curr = getVal(f.key); return typeof curr === 'undefined' || curr === null ? 'All' : String(curr); })()}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                        className={`${theme === 'dark' ? 'appearance-none w-full rounded-xl pl-9 pr-8 py-2 bg-gray-700 text-sm border border-gray-600 focus:ring-green-500 focus:border-green-500 truncate whitespace-nowrap' : 'appearance-none w-full rounded-xl pl-9 pr-8 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500 truncate whitespace-nowrap'}`}
                      >
                        <option value="All">{t('Tất cả','All')}</option>
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
                        value={String(getVal(f.key) ?? '')}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                        className={`${theme === 'dark' ? 'w-full rounded-xl pl-9 px-3 py-2 bg-gray-700 text-sm border border-gray-600 focus:ring-green-500 focus:border-green-500' : 'w-full rounded-xl pl-9 px-3 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500'}`}
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
                        value={String(getVal(f.key) ?? '')}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                        className={`${theme === 'dark' ? 'w-full rounded-xl pl-9 px-3 py-2 bg-gray-700 text-sm border border-gray-600 focus:ring-green-500 focus:border-green-500 truncate' : 'w-full rounded-xl pl-9 px-3 py-2 bg-white text-sm border border-gray-200 focus:ring-green-500 focus:border-green-500 truncate'}`}
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
            className={`${theme === 'dark' ? 'px-4 py-2 bg-gray-700 text-gray-100 rounded-xl hover:bg-gray-600 transition-colors' : 'px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors'}`}
          >
            {t('Đặt Lại','Reset')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FiltersPanel
