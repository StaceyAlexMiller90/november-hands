import { FC } from 'react';
import classNames from 'classnames';
import styles from './Hamburger.module.scss';

interface Props {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  inverted: boolean | undefined;
}
const Hamburger: FC<Props> = ({ mobileMenuOpen, toggleMobileMenu, inverted }) => {
  return (
    <div role="button" tabIndex={0} onKeyDown={toggleMobileMenu} onClick={toggleMobileMenu} className={styles.hamburger}>
      <span
        className={classNames(styles.hamburger__line, {
          [styles.hamburger__line_cross]: mobileMenuOpen,
          [styles.hamburger__line_inverted]: inverted
        })}
      />
    </div>
  );
};

export default Hamburger;
