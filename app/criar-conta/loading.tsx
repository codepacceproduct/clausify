export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Carregando...</p>
      </div>
    </div>
  )
}
