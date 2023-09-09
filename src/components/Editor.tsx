"use client";
// Import React dependencies.
import { useCallback, useEffect, useState } from "react";
// Import the Slate editor factory.
import {
  BaseEditor,
  Descendant,
  Editor as SlateEditor,
  Element as SlateElement,
  Transforms,
  createEditor,
} from "slate";
import { HistoryEditor, withHistory } from "slate-history";

// Import the Slate components and React plugin.
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
} from "slate-react";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "!" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: "bold", bold: true },
      {
        text: ", or add a semantically rendered block quote in the middle of the page, like this:",
      },
    ],
  },
  {
    type: "block-quote",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "paragraph",
    align: "center",
    children: [{ text: "Try it out for yourself!" }],
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
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  // Keep track of state for the value of the editor.
  const [value, setValue] = useState(initialValue);

  const Element = useCallback(
    ({ attributes, children, element }: RenderElementProps) => {
      switch (element.type) {
        case "code":
          return <CodeElement attributes={attributes}>{children}</CodeElement>;
        case "quote":
          return <blockquote {...attributes}>{children}</blockquote>;
        case "link":
          return (
            <a {...attributes} href={element.url}>
              {children}
            </a>
          );
        default:
          return (
            <DefaultElement attributes={attributes} element={element}>
              {children}
            </DefaultElement>
          );
      }
    },
    []
  );

  const renderLeaf = useCallback((props: RenderLeafProps) => {
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
              match: (n) => SlateElement.isElement(n) && n.type === "code",
            });
            // Toggle the block type depending on whether there's already a match.
            Transforms.setNodes(
              editor,
              { type: match ? "paragraph" : "code" },
              {
                match: (n) =>
                  SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
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

          // If user presses ctrl + z, undo last action
          if (event.ctrlKey && event.key === "z") {
            console.log("ctrl + z");
            event.preventDefault();
            editor.undo();
          }

          // Redo if ctrl + shift + z is pressed
          if (event.ctrlKey && event.shiftKey && event.key === "z") {
            console.log("ctrl + shift + z");
            event.preventDefault();
            editor.redo();
          }
        }}
      />
    </Slate>
  );
};
