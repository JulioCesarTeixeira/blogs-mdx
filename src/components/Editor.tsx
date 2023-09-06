"use client";
// Import React dependencies.
import { useCallback, useEffect, useState } from "react";
// Import the Slate editor factory.
import {
  BaseEditor,
  Descendant,
  Element,
  Editor as SlateEditor,
  Transforms,
  createEditor,
} from "slate";
import { HistoryEditor } from "slate-history";

// Import the Slate components and React plugin.
import { Editable, ReactEditor, Slate, useSlate, withReact } from "slate-react";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type HeadingElement = {
  type: "heading";
  level: number;
  children: CustomText[];
};

export type CustomElement = ParagraphElement | HeadingElement;

export type FormattedText = { text: string; bold?: true };

export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

function CodeElement(props: any) {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
}

function DefaultElement(props: any) {
  return <p {...props.attributes}>{props.children}</p>;
}

function Leaf(props: any) {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
      }}
    >
      {props.children}
    </span>
  );
}

function makeBold(editor: BaseEditor & ReactEditor & HistoryEditor) {
  if (!editor.selection) return;

  if (editor.selection && SlateEditor.marks(editor)?.bold) {
    editor.removeMark("bold");
    return;
  }
  editor.addMark("bold", true);
}

function makeItalic(editor: BaseEditor & ReactEditor & HistoryEditor) {
  if (!editor.selection) return;

  editor.addMark("italic", true);
}

function EditorToolbar() {
  const editor = useSlate();

  return (
    <div className="flex row-auto gap-2 my-2">
      <button
        className="py-2 px-4 border-solid border-2 border-gray-300 rounded-md bg-slate-400 hover:bg-slate-600"
        onMouseDown={(event) => {
          event.preventDefault();
          makeBold(editor);
        }}
        style={{
          fontWeight: SlateEditor.marks(editor)?.bold ? "bold" : "normal",
        }}
      >
        Bold
      </button>
      <button
        className="py-2 px-4 border-solid border-2 border-gray-300 rounded-md bg-slate-400 hover:bg-slate-600"
        onMouseDown={(event) => {
          event.preventDefault();
          editor.addMark("italic", true);
        }}
        style={{
          fontStyle: SlateEditor.marks(editor)?.italic ? "italic" : "normal",
        }}
      >
        Italic
      </button>
      <button
        className="py-2 px-4 border-solid border-2 border-gray-300 rounded-md bg-slate-400 hover:bg-slate-600"
        onMouseDown={(event) => {
          event.preventDefault();
          editor.addMark("underline", true);
        }}
      >
        Underline
      </button>
    </div>
  );
}
// Define our app...
export const Editor = () => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => withReact(createEditor()));

  // Keep track of state for the value of the editor.
  const [value, setValue] = useState(initialValue);

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "quote":
        return <blockquote {...props.attributes}>{props.children}</blockquote>;
      case "link":
        return (
          <a {...props.attributes} href={props.element.url}>
            {props.children}
          </a>
        );
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  function insertLink() {
    const link = window.prompt("Enter the URL of the link:");
    if (link) {
      editor.addMark("link", link);
    }
  }

  useEffect(() => {
    console.log(value);
  }, [value]);
  // Render the Slate context.
  return (
    <Slate editor={editor} initialValue={value} onChange={setValue}>
      <EditorToolbar />
      <Editable
        renderLeaf={renderLeaf}
        style={{
          border: "1px solid #ccc",
          padding: "0.5rem",
          minHeight: "5rem",
          width: "100%",
          borderRadius: "0.25rem",
        }}
        renderElement={renderElement}
        onKeyDown={(event) => {
          if (event.key === "`" && event.ctrlKey) {
            // Prevent the "`" from being inserted by default.
            event.preventDefault();
            const [match] = SlateEditor.nodes(editor, {
              // @ts-expect-error
              match: (n) => n.type === "code",
            });
            // Toggle the block type depending on whether there's already a match.
            Transforms.setNodes(
              editor,
              // @ts-expect-error
              { type: match ? "paragraph" : "code" },
              {
                match: (n) =>
                  Element.isElement(n) && SlateEditor.isBlock(editor, n),
              }
            );
          }

          // If user presses ctrl + l, insert a link
          if (event.ctrlKey && event.key === "l") {
            console.log("ctrl + l");
            event.preventDefault();
            insertLink();
          }

          // If user presses ctrl + b, make text bold
          if (event.ctrlKey && event.key === "b") {
            console.log("ctrl + b");
            event.preventDefault();
            editor.toggleMark("bold");
            // makeBold(editor);
          }

          if (event.ctrlKey && event.key === "i") {
            console.log("ctrl + i");
            event.preventDefault();
            editor.toggleMark("italic");
          }

          if (event.key === "&") {
            event.preventDefault();
            editor.insertText("and");
          }
        }}
      />
    </Slate>
  );
};
