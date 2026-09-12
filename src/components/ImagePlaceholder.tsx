export default function ImagePlaceholder({
  height = 160,
  label,
  className = '',
}: {
  height?: number
  label?: string
  className?: string
}) {
  return (
    <div
      className={`w-full flex items-center justify-center text-white/70 text-xs font-medium ${className}`}
      style={{
        height,
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
      }}
    >
      {label ?? 'Image coming soon'}
    </div>
  )
}
