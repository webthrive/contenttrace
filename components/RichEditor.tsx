"use client";

import { useEffect, useRef } from "react";
import { useEditor, useEditorState, EditorContent, type Editor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Indent, Outdent, Pilcrow } from "lucide-react";
import { mdToHtml } from "@/lib/markdown";

// Editor content as markdown: what the analyzer and optimizer read.
function inlineMd(nodes: JSONContent[] | undefined, inHeading = false): string {
  let out = "";
  for (const n of nodes ?? []) {
    if (n.type === "hardBreak") { out += "\n"; continue; }
    if (n.type !== "text" || !n.text) continue;
    const marks = new Set((n.marks ?? []).map((m) => m.type));
    if (inHeading) marks.delete("bold"); // headings are bold already (Google Docs marks them bold)
    let t = n.text;
    // Keep spaces outside the markers, or the markdown would not parse.
    const lead = /^\s*/.exec(t)![0];
    const trail = /\s*$/.exec(t)![0];
    let core = t.slice(lead.length, t.length - trail.length);
    if (core) {
      if (marks.has("bold")) core = `**${core}**`;
      if (marks.has("italic")) core = marks.has("bold") ? `_${core}_` : `*${core}*`;
    }
    t = lead + core + trail;
    out += t;
  }
  return out.replace(/\*\*\*\*/g, ""); // join bold runs that touch
}

function blocksMd(nodes: JSONContent[] | undefined, depth = 0): string[] {
  const out: string[] = [];
  const pad = "  ".repeat(depth);
  for (const n of nodes ?? []) {
    switch (n.type) {
      case "heading": out.push(`${"#".repeat(Math.min(6, Number(n.attrs?.level) || 2))} ${inlineMd(n.content, true)}`, ""); break;
      case "paragraph": out.push(inlineMd(n.content), ""); break;
      case "blockquote": out.push(...blocksMd(n.content).filter((l) => l !== "").map((l) => `> ${l}`), ""); break;
      case "bulletList":
      case "orderedList": {
        let num = Number(n.attrs?.start) || 1;
        for (const li of n.content ?? []) {
          const marker = n.type === "bulletList" ? "- " : `${num++}. `;
          const [first, ...rest] = li.content ?? [];
          const firstText = first?.type === "paragraph" ? inlineMd(first.content) : "";
          out.push(`${pad}${marker}${firstText.replace(/\n/g, `\n${pad}  `)}`);
          const restNodes = first?.type === "paragraph" ? rest : li.content ?? [];
          for (const child of restNodes) {
            if (child.type === "bulletList" || child.type === "orderedList") out.push(...blocksMd([child], depth + 1).filter((l) => l !== ""));
            else out.push(...blocksMd([child]).filter((l) => l !== "").map((l) => `${pad}  ${l}`));
          }
        }
        if (depth === 0) out.push("");
        break;
      }
      default: if (n.content) out.push(...blocksMd(n.content, depth));
    }
  }
  return out;
}

export function editorToMarkdown(editor: Editor): string {
  return blocksMd(editor.getJSON().content).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function ToolButton({ on, disabled, label, onClick, children }: { on?: boolean; disabled?: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" title={label} aria-label={label} aria-pressed={on} disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} onClick={onClick}
      style={{ minWidth: "32px", height: "32px", padding: "0 7px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "2px",
        fontSize: "13px", fontWeight: 700, fontFamily: "var(--font)", borderRadius: "6px", cursor: disabled ? "default" : "pointer",
        border: on ? "1px solid var(--accent)" : "1px solid transparent", background: on ? "var(--accent-light)" : "none",
        color: disabled ? "var(--text-muted)" : on ? "var(--accent)" : "var(--text-secondary)", opacity: disabled ? 0.45 : 1 }}>
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"), italic: e.isActive("italic"),
      h1: e.isActive("heading", { level: 1 }), h2: e.isActive("heading", { level: 2 }), h3: e.isActive("heading", { level: 3 }),
      ul: e.isActive("bulletList"), ol: e.isActive("orderedList"),
      canIndent: e.can().sinkListItem("listItem"), canOutdent: e.can().liftListItem("listItem"),
    }),
  });
  const c = () => editor.chain().focus();
  const sep = <span style={{ width: "1px", alignSelf: "stretch", background: "var(--border)", margin: "4px 4px" }} />;
  return (
    <div role="toolbar" aria-label="Formatting" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "2px", padding: "6px 12px", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
      <ToolButton label="Bold (Ctrl+B)" on={s.bold} onClick={() => c().toggleBold().run()}><Bold size={15} /></ToolButton>
      <ToolButton label="Italic (Ctrl+I)" on={s.italic} onClick={() => c().toggleItalic().run()}><Italic size={15} /></ToolButton>
      {sep}
      <ToolButton label="Heading 1" on={s.h1} onClick={() => c().toggleHeading({ level: 1 }).run()}>H1</ToolButton>
      <ToolButton label="Heading 2" on={s.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}>H2</ToolButton>
      <ToolButton label="Heading 3" on={s.h3} onClick={() => c().toggleHeading({ level: 3 }).run()}>H3</ToolButton>
      <ToolButton label="Normal text" onClick={() => c().setParagraph().run()}><Pilcrow size={15} /></ToolButton>
      {sep}
      <ToolButton label="Bullet list" on={s.ul} onClick={() => c().toggleBulletList().run()}><List size={16} /></ToolButton>
      <ToolButton label="Numbered list" on={s.ol} onClick={() => c().toggleOrderedList().run()}><ListOrdered size={16} /></ToolButton>
      <ToolButton label="Indent (Tab)" disabled={!s.canIndent} onClick={() => c().sinkListItem("listItem").run()}><Indent size={16} /></ToolButton>
      <ToolButton label="Outdent (Shift+Tab)" disabled={!s.canOutdent} onClick={() => c().liftListItem("listItem").run()}><Outdent size={16} /></ToolButton>
    </div>
  );
}

// A small rich text editor. Paste from Google Docs, Word or a web page keeps
// headings, bold, italics and lists. The value goes in and out as markdown.
export default function RichEditor({ value, onChange, placeholder, minHeight = 240, id, editable = true }: {
  value: string; onChange: (md: string) => void; placeholder?: string; minHeight?: number; id?: string; editable?: boolean;
}) {
  const last = useRef(value);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        code: false, codeBlock: false, horizontalRule: false, strike: false, underline: false, link: false,
      }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: mdToHtml(value),
    editorProps: {
      attributes: { id: id ?? "", class: "ct-editor", "aria-multiline": "true", role: "textbox", style: `min-height:${minHeight}px` },
    },
    onUpdate: ({ editor: e }) => {
      const md = editorToMarkdown(e);
      last.current = md;
      onChange(md);
    },
  });

  // Text set from outside (sample text, restored draft): load it into the editor.
  useEffect(() => {
    if (!editor || value === last.current) return;
    last.current = value;
    editor.commands.setContent(mdToHtml(value), { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => { editor?.setEditable(editable); }, [editor, editable]);

  return (
    <div style={{ opacity: editable ? 1 : 0.75 }}>
      {editor && editable && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      {!editor && <div style={{ minHeight }} />}
    </div>
  );
}
