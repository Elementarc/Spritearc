import React from 'react';

/**
 * Creates a default grid with the classname grid_container. You can add additional classnames to get maximum customization.
 * @param props 
 * @returns 
 */
export default function Grid(props: {templateColumn?: string, templateRow?: string, columnGap?: string, rowGap?: string, margin?: string, padding?: string, alignContent?: string, justifyItems?: string, className?: string,  children: any}) {
    const column = props.templateColumn ?? '';
    const row = props.templateRow ?? '';
    const columnGap = props.columnGap ?? '';
    const rowGap = props.rowGap ?? '';
    const padding = props.padding ?? '';
    const margin = props.margin ?? '';
    const className = props.className ?? '';
    const alignContent = props.alignContent ?? '';
    const justifyItems = props.justifyItems ?? '';

    return (
        <div onContextMenu={(e) => e.preventDefault()} style={{
                gridTemplateColumns: column,
                gridTemplateRows: row,
                columnGap: columnGap,
                rowGap: rowGap,
                padding: padding,
                margin: margin,
                alignContent: alignContent,
                justifyItems: justifyItems
            }} className={`grid_container ${className}`}
        >
            {props.children}
        </div>
    );
}
