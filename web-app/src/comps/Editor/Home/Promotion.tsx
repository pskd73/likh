const Promotion = () => {
  return (
    <div>
      {/* Built by */}
      <div className="mt-2 px-2">
        <span className="opacity-40">Built by </span>
        <a
          className="opacity-40 hover:opacity-100 underline"
          href="https://twitter.com/@pramodk73"
          target="_blank"
          rel="noreferrer"
        >
          @pramodk73
        </a>
      </div>

      {/* Community */}
      <div className="mb-2 px-2">
        <span className="opacity-40">Join the </span>
        <a
          className="opacity-40 hover:opacity-100 underline"
          href="https://twitter.com/i/communities/1670013921598795778"
          target="_blank"
          rel="noreferrer"
        >
          community
        </a>
        <span className="opacity-40"> to make it better :)</span>
      </div>
    </div>
  );
};

export default Promotion;
