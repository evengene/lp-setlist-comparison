interface HeaderWrapperProps {
  title: string;
  subtitle: string;
  badge: string;
}

const HeaderWrapper = ( props: HeaderWrapperProps ) => {

  const { title, subtitle, badge } = props;

  return (
    <header className="relative bg-linear-to-b py-6 from-slate-900 to-slate-800 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)'
        }}
      />
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
        <img
          src="/lp-transparent.png"
          alt="Linkin Park"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-4">
            {badge}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 tracking-tight">
            {title}
          </h1>

          <p className="text-lg text-white/70">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  )
}
export default HeaderWrapper;
