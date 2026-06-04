/**
 * Canonical definition of "studied pages" for a topic.
 *
 * studiedPages = selectedPages.length if non-empty,
 *                else total_pages as fallback (topics with no page selection).
 *
 * @param {object} topic – must have `selected_pages` (TEXT/JSON) and `total_pages` (INTEGER)
 * @returns {number}
 */
export function getStudiedPages(topic) {
  let sel = [];
  try {
    const parsed = JSON.parse(topic.selected_pages || '[]');
    if (Array.isArray(parsed)) sel = parsed;
  } catch {}
  return sel.length > 0 ? sel.length : (topic.total_pages || 0);
}
