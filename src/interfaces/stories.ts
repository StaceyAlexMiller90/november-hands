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

export interface OptionItem {
  slug: string;
  uuid: string;
  content: {
    _editable: string;
    _uid: string;
    component: string;
    discountPercentage: string;
    hidden: boolean;
    priceSupplement: string;
    product: {
      content: {
        basePrice: string;
      };
      name: string;
    };
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
