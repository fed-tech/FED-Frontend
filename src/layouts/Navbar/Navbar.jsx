import style from './style/Navbar.module.scss';

export default function Navbar() {
    return (
      <nav className={style.nav}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8a723ff2a5558303e924c50f292f82cb2d54f7fbdbc1f67d588b9a73daaf2c16?apiKey=e259011a0b7e4d6e8e6cd8c4440eea14&"
        alt="Logo"
        className={style.logo}
      />
      <ul className={style.navItems}>
        <li className={style.navLink} >
          Home
        </li>
        <li className={style.navLink} >
          Events
        </li>
        <li className={style.navLink}>
          Social
        </li>
        <li className={style.navLink}>
          Team
        </li>
      </ul>
      <button className={style.authButton}>
        Login/Sign up
      </button>
    </nav>
    )
}
  