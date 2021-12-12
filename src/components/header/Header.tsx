import { FC, Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import Logo from '../logo/Logo';
import styles from './Header.module.scss';

interface Props {
  dropdownMenuOpen: boolean;
  toggleDropdownMenu: Dispatch<SetStateAction<boolean>>;
  isSolid: boolean;
}

const Header: FC<Props> = ({ children, dropdownMenuOpen, toggleDropdownMenu, isSolid }) => {
  return (
    <header className={classNames(styles.header, { [styles.header_solid]: isSolid })}>
      <Logo clickCallback={toggleDropdownMenu} inverted={dropdownMenuOpen} />
      {children}
    </header>
  );
};
export default Header;
