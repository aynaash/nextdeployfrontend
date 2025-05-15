
export const NextDeployLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 shadow-md overflow-hidden">
        <svg
          viewBox="0 0 550 100"
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          role="img"
          className="scale-150"
        >
          <defs>
            <linearGradient id="deployGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C9A7" />
              <stop offset="100%" stopColor="#3F51B5" />
            </linearGradient>
            <linearGradient id="fastGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6F00" />
              <stop offset="100%" stopColor="#FFC107" />
            </linearGradient>
          </defs>

          {/* Flow line with curve */}
          <path
            d="M20 50 Q70 10 120 50 T220 50"
            fill="none"
            stroke="url(#deployGradient)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Fast forward symbol */}
          <g transform="translate(230, 35)" fill="url(#fastGradient)">
            <polygon points="0,0 15,15 0,30" />
            <polygon points="15,0 30,15 15,30" />
          </g>

          {/* Shield for security */}
          <g transform="translate(280, 30)">
            <path
              d="M10 0 Q20 10 30 0 Q30 20 20 30 Q10 20 10 0 Z"
              fill="#00C9A7"
              fillOpacity="0.2"
              stroke="#00C9A7"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-500">Next</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-600">Deploy</span>
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">DevOps Simplified</span>
      </div>
    </div>
  )
}

export default NextDeployLogo
