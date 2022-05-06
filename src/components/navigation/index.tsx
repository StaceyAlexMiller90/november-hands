import { FC, Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import styles from './Navigation.module.scss';
import { useRouter } from 'next/router';

interface Props {
  mobileMenuOpen: boolean;
  toggleMobileMenu: Dispatch<SetStateAction<boolean>>;
  isSolid: boolean;
  inverted: boolean | undefined;
  isMobile: boolean;
}

const Navigation: FC<Props> = ({ mobileMenuOpen, isSolid, inverted, isMobile }) => {
  const router = useRouter();
  const { asPath } = router;
  return (
    <nav
      className={classNames(styles.navigation, {
        [styles.navigation_inverted]: inverted && !isMobile && !isSolid,
        [styles.navigationMobileMenu]: isMobile,
        [styles.navigationMobileMenu_open]: mobileMenuOpen
      })}
    >
      {isMobile && mobileMenuOpen && <div>SearchBar</div>}
      <ul className={styles.navigationList}>
        {isMobile && (
          <li
            className={classNames(styles.navigationItem, {
              [styles.navigationItem_selected]: asPath === '/'
            })}
          >
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
        )}
        <li
          className={classNames(styles.navigationItem, {
            [styles.navigationItem_selected]: asPath === '/about'
          })}
        >
          <Link href="/about">
            <a className={styles.navigationLink}>About</a>
          </Link>
        </li>
        <li
          className={classNames(styles.navigationItem, {
            [styles.navigationItem_selected]: asPath.includes('/shop')
          })}
        >
          <Link href="/shop">
            <a className={styles.navigationLink}>Shop</a>
          </Link>
        </li>
        <li
          className={classNames(styles.navigationItem, {
            [styles.navigationItem_selected]: asPath === '/contact'
          })}
        >
          <Link href="/contact">
            <a className={styles.navigationLink}>Contact</a>
          </Link>
        </li>
        {!isMobile && <li className={classNames(styles.navigationItem)}>Search</li>}
        <li className={classNames(styles.navigationItem)}>
          <Link href="/cart">
            <a className={styles.navigationLink}>Cart</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;
