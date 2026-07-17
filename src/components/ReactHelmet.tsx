import React, { useEffect } from "react";

interface ReactHelmetProps {
  children?: React.ReactNode;
  title?: string;
  meta?: { name?: string; property?: string; content: string }[];
}

export default function ReactHelmet({ children, title, meta }: ReactHelmetProps) {
  useEffect(() => {
    let titleText = title;

    // Parse children for <title> and <meta> tags if children is provided
    if (children) {
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === "title") {
            titleText = (child.props as any).children as string;
          } else if (child.type === "meta") {
            const props = child.props as any;
            const name = props.name;
            const property = props.property;
            const content = props.content;
            if ((name || property) && content) {
              updateMetaTag(name, property, content);
            }
          }
        }
      });
    }

    if (titleText) {
      document.title = titleText;
    }

    if (meta) {
      meta.forEach(({ name, property, content }) => {
        updateMetaTag(name, property, content);
      });
    }
  }, [title, children, meta]);

  return null;
}

function updateMetaTag(name?: string, property?: string, content?: string) {
  if (!content) return;
  
  const attribute = property ? "property" : "name";
  const value = property || name;
  if (!value) return;

  let element = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}
