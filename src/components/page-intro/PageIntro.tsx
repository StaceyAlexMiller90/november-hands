import { FC, Dispatch, SetStateAction } from 'react';
import SbEditable, { SbEditableContent } from 'storyblok-react';

interface Props {
  blok?: SbEditableContent;
}

const PageIntro: FC<Props> = ({ blok }) => {
  return (
    <SbEditable content={blok}>
      <h1>{blok.headline}</h1>
    </SbEditable>
  );
};
export default PageIntro;
