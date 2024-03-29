import Link from 'next/link';
import classNames from 'classnames';
import { logoHref } from './logoBase64';
import styles from './Logo.module.scss';

const Logo = ({ inverted, isWatermark }: { inverted?: boolean; isWatermark?: boolean }) => (
  <Link href="/">
    <a className={styles.logo}>
      <svg
        className={classNames(
          styles.logo__link,
          { [styles.logo__link_inverted]: inverted || isWatermark },
          { [styles.logo__link_watermark]: isWatermark }
        )}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        role="link"
      >
        <path d="M100 0H0V100H100V0Z" fill="url(#pattern0)" />
        <defs>
          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_1_6" transform="translate(-0.0203252) scale(0.00271003)" />
          </pattern>
          <title>November Hands Logo</title>
          <image id="image0_1_6" xlinkHref={logoHref} />
        </defs>
      </svg>
    </a>
  </Link>
);

export default Logo;
