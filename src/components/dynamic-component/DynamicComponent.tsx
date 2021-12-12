import { FC } from 'react';
import PageIntro from '../page-intro/PageIntro';
import SbEditable, { SbEditableContent } from 'storyblok-react';
import dashify from 'dashify';

interface IComponents {
  [key: string]: React.ElementType;
}

interface Props {
  blok?: SbEditableContent;
}

const Components: IComponents = {
  intro: PageIntro
};

const DynamicComponent: FC<Props> = ({ blok }) => {
  if (blok) {
    const componentName = dashify(blok.component);
    if (typeof Components[componentName] !== 'undefined') {
      const FoundComponent = Components[componentName];
      return (
        <SbEditable content={blok} key={blok._uid}>
          <FoundComponent blok={blok} />
        </SbEditable>
      );
    } else {
      return <p>{componentName} is not yet defined.</p>;
    }
  }
  return null;
};

export default DynamicComponent;
