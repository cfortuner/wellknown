import Link from "next/link";

const Header = () => {
  return (
    <>
      <div className="h-2 w-full bg-gradient-to-r from-secondary to-primary"></div>
      <div className="daisy-navbar border-b-2">
        {/** a colorful bar across the top */}
        <div className="flex-1">
          <Link
            href="/"
            className="daisy-btn-ghost daisy-btn text-xl font-semibold normal-case text-primary"
          >
            Wellknown
          </Link>
          <p className="text-sm">AI Plugins Registry</p>
        </div>
        <div className="flex-none">
          <ul className="daisy-menu daisy-menu-horizontal px-1 ">
            <li>
              <Link
                href="https://github.com/cfortuner/wellknown/tree/main/SUBMIT_PLUGIN.md"
                className="daisy-btn-link daisy-link whitespace-nowrap no-underline"
              >
                + Submit Plugin
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="daisy-btn-link daisy-link no-underline"
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
