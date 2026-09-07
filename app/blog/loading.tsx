export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#0e1c4f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-inter text-[#898989]">Loading...</p>
      </div>
    </div>
  )
}
