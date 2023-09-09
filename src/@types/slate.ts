// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
  align?: "left" | "center" | "right";
};

export type HeadingElement = {
  type: "heading";
  level: number;
  children: CustomText[];
};

export type LinkElement = {
  type: "link";
  url: string;
  children: CustomText[];
};

export type CodeElement = {
  type: "code";
  children: CustomText[];
};

export type QuoteElement = {
  type: "quote";
  children: CustomText[];
};

export type ListItemElement = {
  type: "list-item";
  children: CustomText[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  children: ListItemElement[];
};

export type NumberedListElement = {
  type: "numbered-list";
  children: ListItemElement[];
};

export type BlockQuoteElement = {
  type: "block-quote";
  children: CustomText[];
};

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | LinkElement
  | CodeElement
  | QuoteElement
  | BulletedListElement
  | NumberedListElement
  | BlockQuoteElement;

export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  blockquote?: boolean;
};

export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
