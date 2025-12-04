"use client"

import { ptBR, enUS, es } from "date-fns/locale"
import { format } from "date-fns"
import { DayPicker } from "react-day-picker"
import * as Popover from "@radix-ui/react-popover"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useMemo, useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface DatePickerProps {
  value?: Date
  onChange?: (_date?: Date) => void
  fromYear?: number
  toYear?: number
  className?: string
  style?: "calendar" | "dmy"
  allowCalendar?: boolean
}

export function DatePicker({ value, onChange, fromYear = 2000, toYear = 2100, className, style = "dmy", allowCalendar = false }: DatePickerProps) {
  const prefs = typeof window !== "undefined" ? ((window as any).__prefs || (() => { try { return JSON.parse(localStorage.getItem("prefs") || "{}") } catch { return {} } })()) : {}
  const locale = useMemo(() => {
    const lang = prefs?.language || "pt-br"
    if (lang === "en") return enUS
    if (lang === "es") return es
    return ptBR
  }, [prefs?.language])
  const [open, setOpen] = useState(false)
  const today = useMemo(() => new Date(), [])
  const pattern = (() => {
    const f = prefs?.dateFormat || "dd-mm-yyyy"
    if (f === "mm-dd-yyyy") return "MM/dd/yyyy"
    if (f === "yyyy-mm-dd") return "yyyy-MM-dd"
    return "dd/MM/yyyy"
  })()
  const label = value ? format(value, pattern, { locale }) : format(today, pattern, { locale })
  const initialValueRef = useRef<Date | undefined>(value)
  useEffect(() => {
    if (initialValueRef.current === undefined) {
      onChange?.(today)
    }
  }, [onChange, today])

  const [day, setDay] = useState<string | undefined>(value ? String(value.getDate()) : undefined)
  const [month, setMonth] = useState<string | undefined>(value ? String(value.getMonth() + 1) : undefined)
  const [year, setYear] = useState<string | undefined>(value ? String(value.getFullYear()) : undefined)

  

  const months = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ]

  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => String(fromYear + i))

  const current = value ?? today
  const maxDays = (() => {
    const y = Number(year ?? String(current.getFullYear()))
    const m = Number(month ?? String(current.getMonth() + 1))
    return new Date(y, m, 0).getDate()
  })()

  const days = Array.from({ length: maxDays }, (_, i) => String(i + 1))

  function applyIfReady(d?: string, m?: string, y?: string) {
    const dd = d ?? day
    const mm = m ?? month
    const yy = y ?? year
    if (dd && mm && yy) {
      const date = new Date(Number(yy), Number(mm) - 1, Number(dd))
      onChange?.(date)
      setOpen(false)
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 inline-flex w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
            className,
          )}
        >
          <span className={cn("flex items-center gap-2", !value && "text-muted-foreground")}> 
            <CalendarIcon className="h-4 w-4" />
            {label}
          </span>
          {value ? (
            <X className="h-4 w-4 opacity-60" onClick={(e) => { e.stopPropagation(); onChange?.(undefined) }} />
          ) : null}
        </button>
      </Popover.Trigger>
      <Popover.Content sideOffset={8} className="z-50 rounded-xl border bg-card text-card-foreground p-3 shadow-md">
        {allowCalendar && style === "calendar" ? (
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(d) => { onChange?.(d); if (d) setOpen(false) }}
            locale={locale}
            showOutsideDays
            weekStartsOn={0}
            numberOfMonths={1}
            fromYear={fromYear}
            toYear={toYear}
            captionLayout="dropdown"
            className="select-none"
            classNames={{
              months: "flex",
              month: "space-y-2",
              caption: "flex items-center justify-between px-2 py-1",
              caption_label: "text-sm font-medium",
              caption_dropdowns: "flex items-center gap-2",
              nav: "flex items-center gap-1",
              button_previous: "h-8 w-8 inline-flex items-center justify-center rounded-md border hover:bg-muted",
              button_next: "h-8 w-8 inline-flex items-center justify-center rounded-md border hover:bg-muted",
              table: "w-full border-collapse",
              head_row: "grid grid-cols-7 gap-1",
              head_cell: "text-xs text-muted-foreground text-center py-1",
              row: "grid grid-cols-7 gap-1",
              cell: "p-1",
              day: "aspect-square w-full rounded text-sm hover:bg-muted flex items-center justify-center",
              day_today: "border border-primary",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary",
              day_outside: "text-muted-foreground/60",
              day_disabled: "opacity-50",
            }}
            components={{
              IconLeft: () => <ChevronLeft className="h-4 w-4" />,
              IconRight: () => <ChevronRight className="h-4 w-4" />,
            }}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Select value={day ?? String(current.getDate())} onValueChange={(v) => { setDay(v); applyIfReady(v, undefined, undefined) }}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Dia" />
              </SelectTrigger>
              <SelectContent>
                {days.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={month ?? String(current.getMonth() + 1)} onValueChange={(v) => { setMonth(v); if ((day ?? String(current.getDate())) && Number(day ?? String(current.getDate())) > new Date(Number(year ?? String(current.getFullYear())), Number(v), 0).getDate()) setDay(String(new Date(Number(year ?? String(current.getFullYear())), Number(v), 0).getDate())); applyIfReady(undefined, v, undefined) }}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year ?? String(current.getFullYear())} onValueChange={(v) => { setYear(v); const m = Number(month ?? String(current.getMonth() + 1)); const d = Number(day ?? String(current.getDate())); const mdays = new Date(Number(v), m, 0).getDate(); if (d > mdays) setDay(String(mdays)); applyIfReady(undefined, undefined, v) }}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </Popover.Content>
    </Popover.Root>
  )
}
