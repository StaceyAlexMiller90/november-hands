import { FC } from 'react';
import SbEditable, { SbEditableContent } from 'storyblok-react';
import dashify from 'dashify';
import GalleryItem from '../gallery-item';

interface IComponents {
  [key: string]: React.ElementType;
}

interface Props {
  blok?: SbEditableContent;
}

const Components: IComponents = {
  galleryItem: GalleryItem
};

const DynamicComponent: FC<Props> = ({ blok }) => {
  if (blok) {
    if (typeof Components[blok.component] !== 'undefined') {
      const FoundComponent = Components[blok.component];
      return (
        <SbEditable content={{ ...blok, _editable: blok._editable || undefined }} key={blok._uid}>
          <FoundComponent blok={blok} />
        </SbEditable>
      );
    }
  }
  return null;
};

export default DynamicComponent;
