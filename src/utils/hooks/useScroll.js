const ref = { current: null };

export default function useScroll() {
  function scrollToElement() {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
  return { ref, scrollToElement };
}