export default function Footer() {
  return (
    <footer className="bg-[#011640] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold mb-2">TalentFlight</span>
        <p className="text-[#9CA3AF] text-sm">
          © {new Date().getFullYear()} TalentFlight. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
