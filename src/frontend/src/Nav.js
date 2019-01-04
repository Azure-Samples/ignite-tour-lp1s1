import React from "react";

const Nav = () => (
  <nav>
    <h1>{ process.env.CUSTOM_TITLE || 'TAILWIND TRADERS' }</h1>
  </nav>
);

export default Nav;
