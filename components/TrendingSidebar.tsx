const TrendingSidebar: React.FC = () => {
  return (
    <aside className="w-64 p-4 bg-[#0f1c2e] border-l border-[#2a3b4c] hidden lg:block">
      <h2 className="text-lg font-semibold text-white mb-4">Trending Topics</h2>
      <ul className="space-y-2">
        <li>
          <a href="#" className="text-[#a0b0c0] hover:text-white">
            New Event in Auroville!
          </a>
          <span className="block text-xs text-[#f5a623]">20 replies</span>
        </li>
        <li>
          <a href="#" className="text-[#a0b0c0] hover:text-white">
            Sustainable Living Tips
          </a>
          <span className="block text-xs text-[#f5a623]">15 replies</span>
        </li>
        <li>
          <a href="#" className="text-[#a0b0c0] hover:text-white">
            Community Feedback
          </a>
          <span className="block text-xs text-[#f5a623]">10 replies</span>
        </li>
      </ul>
    </aside>
  );
};

export default TrendingSidebar;
