import React from 'react';

export default function Flex(props: {columnGap?: string, rowGap?: string, margin?: string, padding?: string, alignItems?: string, justifyContent?: string, className?: string,  children: any}) {
  const columnGap = props.columnGap ?? '';
  const rowGap = props.rowGap ?? '';
  const padding = props.padding ?? '';
  const margin = props.margin ?? '';
  const className = props.className ?? '';
  const alignItems = props.alignItems ?? '';
  const justifyContent = props.justifyContent ?? '';

  return (
      <div onContextMenu={(e) => e.preventDefault()} style={{
            columnGap: columnGap,
            rowGap: rowGap,
            padding: padding,
            margin: margin,
            alignContent: alignItems,
            justifyItems: justifyContent
        }} className={`flex_container ${className}`}
      >
          {props.children}
      </div>
  );
}
