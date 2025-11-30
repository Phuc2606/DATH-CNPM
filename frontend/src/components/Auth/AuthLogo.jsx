import React from "react";
import { Link } from "react-router-dom";
const AuthLogo = () => {
  return (
    <Link
      to="/"
      className="absolute top-0 left-1/2 -translate-x-1/2 p-3 text-3xl !text-(--color-primary) mt-3 font-bold outline-none"
    >
      TechShop
    </Link>
  );
};

export default AuthLogo;
