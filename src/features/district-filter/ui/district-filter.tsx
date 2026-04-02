type DistrictFilterProps = {
  districts: string[]
  selectedDistrict: string | null
  onSelect: (district: string | null) => void
}

export function DistrictFilter({
  districts,
  selectedDistrict,
  onSelect,
}: DistrictFilterProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
      <div className="font-medium text-white">구 필터</div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`rounded-full border px-3 py-1.5 text-xs transition ${
            selectedDistrict === null
              ? 'border-[#ff8fab] bg-[#ff8fab] text-white'
              : 'border-[#ffb3c6] bg-white text-[#ff6b9d]'
          }`}
        >
          전체
        </button>
        {districts.map((district) => (
          <button
            key={district}
            type="button"
            onClick={() => onSelect(district)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              selectedDistrict === district
                ? 'border-[#ff8fab] bg-[#ff8fab] text-white'
                : 'border-[#ffb3c6] bg-white text-[#ff6b9d]'
            }`}
          >
            {district}
          </button>
        ))}
      </div>
    </div>
  )
}
