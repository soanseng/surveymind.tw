import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/big-5" className="hover:text-gray-300">Big5</Link>
        </li>
        <li>
          <Link href="/gad" className="hover:text-gray-300">GAD</Link>
        </li>
        <li>
          <Link href="/phq-9" className="hover:text-gray-300">PHQ-9</Link>
        </li>
        <li>
          <Link href="/asrs" className="hover:text-gray-300">ASRS 成人ADHD自我評估問卷</Link>
        </li>
        <li>
          <Link href="/psqi" className="hover:text-gray-300">匹茲堡睡眠品質量表</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;