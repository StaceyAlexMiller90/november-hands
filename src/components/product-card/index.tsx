import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import { getObjectPosition, getPriceInfo } from '../../utils/utils';
import styles from './ProductCard.module.scss';
import { OptionItem } from '../../interfaces/stories';

const ProductCard: FC<OptionItem> = ({ content, slug }) => {
  const { colour, product, priceSupplement, discountPercentage, mainImage } = content;
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
        <h5 className={styles.productCard_product}>{product.name}</h5>
        <h6 className={styles.productCard_colour}>{colour.name}</h6>
        <div className={styles.productCard_pricing}>
          {discountPercentage && (
            <p className={classNames(styles.productCard_discountTag, styles.productCard_priceItem)}>{discountPercentage}%</p>
          )}
          {discountedPrice && (
            <p className={classNames(styles.productCard_discountPrice, styles.productCard_priceItem)}>€ {discountedPrice}</p>
          )}
          <p className={classNames(styles.productCard_price, { [styles.productCard_price_old]: discountPercentage })}>
            € {price}
          </p>
        </div>
      </a>
    </Link>
  );
};

export default ProductCard;
