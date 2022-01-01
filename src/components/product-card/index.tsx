import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import { ImageProps } from '../../interfaces/general';
import { getObjectPosition, getPriceInfo } from '../../utils/utils';
import styles from './productCard.module.scss';

interface Props {
  product: {
    name: string;
  };
  colour: {
    name: string;
  };
  priceSupplement: string;
  mainImage: ImageProps;
  secondaryImages: ImageProps[];
  slug: string;
  discountPercentage: string;
}

const ProductCard: FC<Props> = ({
  colour,
  product,
  priceSupplement,
  discountPercentage,
  mainImage,
  secondaryImages,
  slug
}) => {
  const price = getPriceInfo(product, priceSupplement);
  const discountedPrice = discountPercentage && Math.round(price - (price / 100) * Number(discountPercentage));

  return (
    <Link href={`/${slug}`}>
      <a className={styles.productCard}>
        <div className={styles.productCard_imageWrapper}>
          <Image
            className={styles.productCard_image}
            src={`${mainImage.filename}/m/`}
            alt={mainImage.alt}
            layout="fill"
            objectPosition={getObjectPosition(mainImage)}
          />
        </div>
        <h5>{product.name}</h5>
        <h6>{colour.name}</h6>
        {discountedPrice && <p>{discountedPrice}</p>}
        <p>{price}</p>
      </a>
    </Link>
  );
};

export default ProductCard;
