import { Dispatch, SetStateAction } from 'react';

export interface IRichTextItem {
  type: string;
  content: {
    text: string;
    type: string;
    marks?: {
      type: string;
    };
  }[];
}
export interface IRichText {
  content: IRichTextItem[];
  type: string;
}

export interface ITag {
  uuid: string;
  content: {
    name: string;
  };
}
