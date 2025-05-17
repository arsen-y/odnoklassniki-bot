function parse_text_htmlspch(a) {
  a = a.replace(/</g, "&lt;");
  a = a.replace(/>/g, "&gt;");
  return (a = a.replace(/"/g, "&quot;"));
}
