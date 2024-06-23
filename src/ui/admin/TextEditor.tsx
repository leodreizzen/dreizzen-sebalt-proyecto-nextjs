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
        if (editor && initialHtml)
            editor.tryParseHTMLToBlocks(initialHtml).catch(console.error)
    }, [editor, initialHtml]);


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
        getHtml: getHtml
    }

}

