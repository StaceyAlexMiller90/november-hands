import { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import SbEditable, { SbEditableContent } from 'storyblok-react';
import { getObjectPosition } from '../../utils/utils';
import styles from './PageIntro.module.scss';

interface Props {
  blok: SbEditableContent & {
    darkOverlay: boolean;
    headline: string;
    image: {
      focus: string;
      alt: string;
      filename: string;
    };
  };
}

const PageIntro: FC<Props> = ({ blok }) => {
  if (!blok?.image) {
    return null;
  }

  return (
    <SbEditable content={{ ...blok, _editable: blok._editable || undefined }}>
      <div className={styles.pageIntro}>
        <div
          className={classNames(styles.pageIntro_imageWrapper, { [styles.pageIntro_imageWrapper_dark]: blok.darkOverlay })}
        >
          <Image
            className={styles.pageIntro_image}
            src={`${blok.image.filename}/m/`}
            alt={blok.image.alt}
            layout="fill"
            objectPosition={getObjectPosition(blok.image)}
            priority
          />
        </div>
        <h1 className={classNames(styles.pageIntro_headline, { [styles.pageIntro_headline_white]: blok.darkOverlay })}>
          {blok.headline}
        </h1>
      </div>
    </SbEditable>
  );
};
export default PageIntro;
