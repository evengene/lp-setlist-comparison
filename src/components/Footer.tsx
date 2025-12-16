

export const Footer = () => {
  return (
    <div className="text-gray-600 text-center py-6 mt-8">
      <p className="text-sm mb-2">
        Celebrating the artistry of Linkin Park's live performances.
      </p>
      <p className="text-sm">
        Setlist data provided by{' '}
        <a
          href="https://www.setlist.fm/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          setlist.fm
        </a>
        • For fans made with ❤️ by <a href={"https://github.com/evengene"} className="text-blue-400 hover:text-blue-300 underline">evengene</a>
      </p>
    </div>
  );
}
