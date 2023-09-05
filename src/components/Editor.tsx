"use client";
// Import React dependencies.
import { useEffect, useState } from "react";
// Import the Slate editor factory.
import { Descendant, createEditor } from "slate";

// Import the Slate components and React plugin.
import { Editable, Slate, withReact } from "slate-react";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

// Define our app...
export const Editor = () => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => withReact(createEditor()));

  // Keep track of state for the value of the editor.
  const [value, setValue] = useState(initialValue);

  function insertLink() {
    const link = window.prompt("Enter the URL of the link:");
    if (link) {
      editor.insertText(link);
    }
  }

  function makeBold() {
    editor.addMark("bold", true);
  }

  useEffect(() => {
    console.log(value);
  }, [value]);
  // Render the Slate context.
  return (
    <Slate editor={editor} initialValue={value} onChange={setValue}>
      <Editable
        style={{
          border: "1px solid #ccc",
          padding: "0.5rem",
          minHeight: "5rem",
          width: "100%",
          borderRadius: "0.25rem",
        }}
        onKeyDown={(event) => {
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
            makeBold();
          }
        }}
      />
    </Slate>
  );
};
