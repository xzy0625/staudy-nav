import Editor from 'for-editor';
import { useState } from 'react';

interface IProps {
  lineNum?: boolean;
  placeholder?: string;
  preview?: boolean;
  language?: 'zh-CN' | 'en';
  style?: object;
  height?: string;
}

const MarkdownEditor: React.FC<IProps> = (props: IProps) => {
  const {
    height = '200px',
    style = {},
    lineNum = false,
    preview = false,
    placeholder = '请输入您此刻的想法吧',
    language = 'zh-CN',
  } = props;

  const [value, setValue] = useState('');

  const onChange = (value: string) => {
    console.log(value);
    setValue(value);
  };

  return (
    <Editor
      style={style}
      preview={preview}
      language={language}
      lineNum={lineNum as unknown as number}
      value={value}
      height={height}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default MarkdownEditor;
