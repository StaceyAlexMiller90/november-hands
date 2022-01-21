import { FC, useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import SbEditable from 'storyblok-react';
import { getObjectPosition } from '../../utils/utils';
import styles from './GalleryItem.module.scss';
import { GalleryItem } from '../../interfaces/stories';

interface Props {
  blok: GalleryItem;
  position: number;
}

const GalleryItem: FC<Props> = ({ blok, position }) => {
  const [isVisible, setIsVisible] = useState(position < 2);
  const targetRef = useRef(null);
  let observer: IntersectionObserver;

  const onIntersect = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio <= 0 && !entry.isIntersecting) return;

      if (targetRef.current && entry.target === targetRef.current) {
        setIsVisible(true);
        observer.unobserve(targetRef.current);
      }
    });
  };

  useEffect(() => {
    if (!!window.IntersectionObserver && !!targetRef.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      observer = new IntersectionObserver(onIntersect);
      observer.observe(targetRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [targetRef.current]);

  if (!blok.image) {
    return null;
  }
  return (
    <SbEditable content={{ ...blok, _editable: blok._editable || undefined }}>
      <div ref={targetRef} className={classNames(styles.galleryItem, { [styles.galleryItem_animate]: isVisible })}>
        <div className={styles.galleryItem_container}>
          <p className={styles.galleryItem_text}>{blok.text}</p>
          <div className={styles.galleryItem_imageWrapper}>
            <Image
              className={styles.galleryItem_image}
              src={`${blok.image.filename}/m/`}
              alt={blok.image.alt}
              layout="fill"
              objectPosition={getObjectPosition(blok.image)}
            />
          </div>
        </div>
      </div>
    </SbEditable>
  );
};
export default GalleryItem;
