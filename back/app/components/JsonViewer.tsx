import React from "react";

interface JsonViewerProps {
  data: any; // 表示するJSONデータ
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  return (
    <pre
      style={{
        whiteSpace: "pre-wrap", // 改行を維持する
        wordWrap: "break-word", // 長い行を折り返す
        backgroundColor: "#f5f5f5", // 背景色（任意）
        padding: "10px", // 内側余白（任意）
        border: "1px solid #ddd", // 枠線（任意）
        borderRadius: "5px", // 角丸（任意）
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default JsonViewer;
