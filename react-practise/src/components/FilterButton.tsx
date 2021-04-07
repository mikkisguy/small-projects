import React from "react";

// props: Props
export default function FilterButton() {
  return (
    <button type="button" className="btn toggle-btn">
      <span className="visually-hidden">Show </span>
      <span>all</span>
      <span className="visually-hidden"> tasks</span>
    </button>
  );
}
