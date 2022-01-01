import { FC } from 'react';
import classNames from 'classnames';
import SbEditable, { SbEditableContent } from 'storyblok-react';
import { IconName, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import { getObjectPosition } from '../../utils/utils';

import styles from './footer.module.scss';

library.add(fab);

interface Props {
  blok: SbEditableContent;
}

const Footer: FC<Props> = ({ blok }) => {
  if (!blok) {
    return null;
  }

  return (
    <SbEditable content={{ ...blok, _editable: blok._editable || undefined }}>
      <div
        className={classNames(styles.footer_imageWrapper, {
          [styles.footer_imageWrapper_dark]: blok.darkOverlay
        })}
      >
        <Image
          className={styles.footer_image}
          src={`${blok.image.filename}/m/`}
          alt={blok.image.alt}
          layout="fill"
          objectPosition={getObjectPosition(blok.image)}
        />
      </div>
      <footer className={classNames(styles.footer, { [styles.footer_dark]: blok.darkOverlay })}>
        <div className={styles.footer_socialIcons}>
          {blok.socials.map((social: { content: { id: IconName; url: string } }) => {
            const { id, url } = social.content;
            return (
              <Link key={id} href={url}>
                <a className={styles.footer_socialIcon}>
                  <FontAwesomeIcon icon={['fab', id]} />
                </a>
              </Link>
            );
          })}
        </div>
        <ul className={styles.footerNavigationList}>
          {blok.activeLinks?.map((link: { slug: string; name: string }) => (
            <li key={link.slug} className={classNames(styles.footerNavigationItem)}>
              <Link href={`/${link.slug}`}>
                <a>{link.name}</a>
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.footer_copywright}>{blok.copywright}</p>
      </footer>
    </SbEditable>
  );
};
export default Footer;
