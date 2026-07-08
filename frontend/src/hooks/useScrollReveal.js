import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nodesFor = () => Array.from(root.querySelectorAll("[data-reveal]"));

    let nodes = nodesFor();
    let observer;

    const refresh = () => {
      nodes = nodesFor();
      root.classList.add("reveal-ready");
      nodes.forEach((node, index) => {
        node.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 90}ms`);
        observer?.observe(node);
      });
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" }
    );

    refresh();
    window.addEventListener("resize", refresh);
    const rescan = window.setTimeout(refresh, 600);
    const mutationObserver = new MutationObserver(refresh);
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(rescan);
      window.removeEventListener("resize", refresh);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return rootRef;
}
