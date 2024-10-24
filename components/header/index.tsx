import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useOnClickOutside from "use-onclickoutside";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { RootState } from "store";
import axios from "axios";
// import { DarkModeSwitch } from "react-toggle-dark-mode";
// import { ThemeContext } from "components/context/theme-context";

type HeaderType = {
  isErrorPage?: Boolean;
};

const Header = ({ isErrorPage }: HeaderType) => {
  const router = useRouter();
  const { status } = useSession()
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const arrayPaths = ["/"];
  
  
  const [onTop, setOnTop] = useState(
    !arrayPaths.includes(router.pathname) || isErrorPage ? false : true
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [data, setData] = useState([]);
  const navRef = useRef(null);
  const searchRef = useRef(null);

  // const { theme, toggleTheme } = useContext(ThemeContext);
  
  const headerClass = () => {
    if (window.pageYOffset === 0) {
      setOnTop(true);
    } else {
      setOnTop(false);
    }
  };
  const fetcher = async() => {
    try {
      const categories = await axios.get('/api/categories')
        .then((res) => res.data)
      
      setData(categories);
    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(() => {
    if (!arrayPaths.includes(router.pathname) || isErrorPage) {
      return;
    }

    headerClass();
    window.onscroll = function () {
      headerClass();
    };
  }, []);
  useEffect(() => {
    fetcher();
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  // on click outside
  useOnClickOutside(navRef, closeMenu);
  useOnClickOutside(searchRef, closeSearch);

  return (
    <header className={`site-header ${!onTop ? "site-header--fixed" : ""}`}>
      <div className="container">
        <Link href="/">
          <div className="site-logo">
            {/* <Logo /> */}
            <img
              className="logo"
              src='/images/logos/Logo_Coraza-15.png'
            />
            {/* CORAZA */}
          </div>
        </Link>
        <nav
          ref={navRef}
          className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
        >
          {/* <Link href="/products">Mochilas</Link>
          <a href="#">Billeteras</a>
          <a href="#">Indumentaria</a>
          <a href="#">Bolsos</a> */}

          {
            !data ? (
              <div>Cargando categorías</div>
            ) : data.map( (cat: any) => {
              return (
                <a href="" key={cat._id}>{cat.title}</a>
              )
            } )
          }
          <button className="site-nav__btn">
            <p>Cuenta</p>
          </button>
        </nav>

        <div className="site-header__actions">
          <button
            ref={searchRef}
            className={`search-form-wrapper ${
              searchOpen ? "search-form--active" : ""
            }`}
          >
            <form className={`search-form`}>
              <i
                className="icon-cancel"
                onClick={() => setSearchOpen(!searchOpen)}
              ></i>
              <input
                type="text"
                name="search"
                placeholder="Enter the product you are looking for"
              />
            </form>
            <i
              onClick={() => setSearchOpen(!searchOpen)}
              className="icon-search"
            ></i>
          </button>
          {/* <DarkModeSwitch
            className="dark-toggle"
            checked={theme === "light" ? false : true}
            onChange={toggleTheme}
            moonColor={!onTop ? "white" : "black"}
            sunColor={!onTop ? "black" : "white"}
            size={24}
          /> */}
          <Link href="/cart" legacyBehavior>
            <button className="btn-cart">
              <i className="icon-cart"></i>
              {cartItems.length > 0 && (
                <span className="btn-cart__count">{cartItems.length}</span>
              )}
            </button>
          </Link>

          {
            status === "loading" ? (
              <button className="site-header__btn-avatar">
              <i className="icon-avatar"></i>
            </button>
            ) :
            status === "unauthenticated" ? (
              <Link href="/login" legacyBehavior>
                <button className="site-header__btn-avatar">
                  <i className="icon-avatar"></i>
                </button>
              </Link>
            ) : (
              <Link href="/account" legacyBehavior>
              <button className="site-header__btn-avatar">
                <i className="icon-avatar"></i>
              </button>
            </Link>
            )
          }



          <button
            onClick={() => setMenuOpen(true)}
            className="site-header__btn-menu"
          >
            <i className="btn-hamburger">
              <span></span>
            </i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
