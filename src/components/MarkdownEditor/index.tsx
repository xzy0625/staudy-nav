import Editor from 'for-editor';
import { useState } from 'react';

interface IProps {
  lineNum?: boolean;
  placeholder?: string;
  preview?: boolean;
  language?: 'zh-CN' | 'en';
  style?: object;
  height?: string;
  onChange: (value: any) => void;
  value: string;
  [props: string]: any;
}

const MarkdownEditor: React.FC<IProps> = (props: IProps) => {
  const {
    height = '200px',
    style = {},
    lineNum = false,
    preview = false,
    placeholder = '请输入您此刻的想法吧',
    language = 'zh-CN',
    value = '',
    onChange,
  } = props;

  const onEditotChange = (value: string) => {
    onChange?.(value);
  };

  return (
    <Editor
      style={style}
      preview={preview}
      language={language}
      lineNum={lineNum as unknown as number}
      value={value}
      height={height}
      onChange={onEditotChange}
      placeholder={placeholder}
    />
  );
};

export default MarkdownEditor;
