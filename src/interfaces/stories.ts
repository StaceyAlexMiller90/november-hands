import { IconName } from '@fortawesome/fontawesome-svg-core';
import { ImageProps } from './general';

export interface CategoryCollection {
  uuid: string;
  name: string;
  slug: string;
}

export interface Footer {
  _editable: string;
  _uid: string;
  component: string;
  copywright: string;
  darkOverlay: boolean;
  image: ImageProps;
  activeLinks: {
    slug: string;
    name: string;
  }[];
  socials: {
    content: {
      id: IconName;
      url: string;
    };
  }[];
}

export interface ProductPage {
  content: {
    _editable: string;
    _uid: string;
    component: string;
    subtitle: string;
    title: string;
    bannerImage: ImageProps;
  };
}

export interface ProductItem {
  content: {
    dimensions: string;
    subtitle: string;
    description: string;
    category: CategoryCollection;
  };
  name: string;
  uuid: string;
}
export interface OptionItem {
  slug: string;
  uuid: string;
  content: {
    _editable: string;
    _uid: string;
    component: string;
    discountPercentage: string;
    hidden: boolean;
    price: number;
    product: ProductItem;
    colour: {
      name: string;
    };
    mainImage: ImageProps;
    secondaryImages: ImageProps[];
    collection: CategoryCollection;
  };
}

export interface GalleryItem {
  _editable: string;
  _uid: string;
  component: string;
  text: string;
  image: ImageProps;
}
