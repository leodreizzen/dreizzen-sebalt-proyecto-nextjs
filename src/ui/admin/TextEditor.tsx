import "@blocknote/core/fonts/inter.css";
import {BlockNoteView} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import clsx from "clsx";
import {BlockNoteEditor} from "@blocknote/core";

export default function useHTMLTextEditor(initialHtml?: string) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, []);

    const editor = useMemo(() => {
        if (!isClient)
            return null
        else
            return BlockNoteEditor.create({domAttributes: {editor: {class: "h-full overflow-auto"}}})
    }, [isClient]);

    useEffect(() => {
        if (editor && initialHtml) {
            const blocks =  editor.tryParseHTMLToBlocks(initialHtml).then(blocks=> editor.replaceBlocks(editor.document, blocks))
        }
    }, [editor, initialHtml]);

    const parseHtml = useCallback(async (html: string) => {
        console.log(editor, html)
        if (!editor)
            return null
        else {
            const blocks =  await editor.tryParseHTMLToBlocks(html);
            editor.replaceBlocks(editor.document, blocks)
        }
    }, [editor])

    const getHtml = useCallback(async () => {
        if (!editor)
            return null
        else
            return await editor.blocksToHTMLLossy();
    }, [editor]);

    const View = useCallback(function TextEditorView({className}: { className?: string }) {
        return (
            <div className={clsx(className, "overflow-clip relative")} >
                {
                    editor ?
                        <BlockNoteView className="size-full" theme="dark" editor={editor}/> :
                        <div className={"size-full inline-block"}></div>
                }
            </div>
        )
    }, [editor]);

    return {
        View: View,
        getHtml: getHtml,
        setHtml: parseHtml
    }

}

