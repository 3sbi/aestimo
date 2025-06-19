/** removes anything except letters, numbers, and dashes */
export function slugify(slug: string | undefined): string {
  if (typeof slug !== "string") return "";
  return (
    slug
      .replace(/[^A-Za-z0-9\s]/g, "")
      .trim()
      // Replace spaces with replacement character, treating multiple consecutive
      // spaces as a single space.
      .replace(/\s+/g, "-")
      .toLowerCase()
  );
}
