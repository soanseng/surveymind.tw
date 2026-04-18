interface AnatomeePromoProps {
  variant: 'before' | 'after';
}

const AnatomeePromo = ({ variant }: AnatomeePromoProps) => {
  if (variant === 'before') {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-5 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden>🧬</span>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-purple-900 mb-1">
              想要更深入的人格剖析？試試 Anatomee
            </h3>
            <p className="text-sm text-purple-800 leading-relaxed mb-3">
              <a
                href="https://anatomee.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-purple-600"
              >
                anatomee.app
              </a>{' '}
              是我們專為人格測量打造的進階平台，提供更完整的題庫、互動式分析與個人化報告，適合想要深入探索自我的您。您仍可繼續下方量表，或先前往 Anatomee 體驗。
            </p>
            <a
              href="https://anatomee.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              前往 Anatomee →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-4 rounded-lg">
      <h4 className="font-semibold text-purple-900 mb-2 text-sm flex items-center gap-2">
        <span aria-hidden>🧬</span>延伸探索：Anatomee
      </h4>
      <p className="text-xs text-purple-800 leading-relaxed mb-3">
        想獲得更完整、更個人化的人格分析？前往{' '}
        <a
          href="https://anatomee.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline hover:text-purple-600"
        >
          anatomee.app
        </a>
        ，我們的進階人格測量平台，提供更細緻的面向分析與互動式報告。
      </p>
      <a
        href="https://anatomee.app"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors"
      >
        前往 Anatomee →
      </a>
    </div>
  );
};

export default AnatomeePromo;
