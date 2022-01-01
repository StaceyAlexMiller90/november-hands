import { ImageProps } from '../interfaces/general';

export const getObjectPosition = (image: ImageProps) => {
  if (!image.focus) {
    return '50% 50%';
  }

  const leftTop = image.focus.split(':')[0];
  const [left, top] = leftTop.split('x');
  const regex = new RegExp(/([0-9]{2,4})x([0-9]{2,4})/);
  const [, width, height] = image.filename.match(regex) || [];

  if (!width || !height) {
    return '50% 50%';
  }

  const leftDistance = (Number(left) / Number(width)) * 100;
  const topDistance = (Number(top) / Number(height)) * 100;
  return `${leftDistance}% ${topDistance}%`;
};

export const getPriceInfo = (product: { content: { basePrice: string } }, priceSupplement: string) => {
  const { basePrice } = product.content;
  return priceSupplement ? Number(basePrice) + Number(priceSupplement) : basePrice;
};
