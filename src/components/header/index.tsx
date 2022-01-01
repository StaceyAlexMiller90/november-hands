import { FC, Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import Logo from '../logo';
import styles from './header.module.scss';

interface Props {
  isSolid: boolean;
  isDark: boolean | undefined;
}

const Header: FC<Props> = ({ children, isSolid, isDark }) => {
  return (
    <header className={classNames(styles.header, { [styles.header_solid]: isSolid })}>
      <Logo inverted={!!isDark && !isSolid} />
      {children}
    </header>
  );
};
export default Header;
