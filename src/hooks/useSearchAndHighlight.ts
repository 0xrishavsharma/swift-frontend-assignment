import { useState, useEffect } from "react";

interface HighlightProps<T> {
  // data: T[];
  query: string;
  keys: (keyof T)[];
}

function useSearchAndHighlight<T extends Record<string, unknown>>(
  data: T[],
  debouncedSearchQuery: string,
  { query, keys }: HighlightProps<T>,
) {
  const [filteredData, setFilteredData] = useState<T[]>([]);

  useEffect(() => {
    if (!query) {
      setFilteredData(data);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    const highlightedData = data
      .filter((item) =>
        keys.some(
          (key) =>
            item[key] &&
            item[key].toString().toLowerCase().includes(lowerCaseQuery),
        ),
      )
      .map((item) => {
        const highlightedItem = { ...item };
        keys.forEach((key) => {
          if (typeof highlightedItem[key] === "string") {
            const matchIndex = highlightedItem[key]
              .toLowerCase()
              .indexOf(lowerCaseQuery);
            if (matchIndex !== -1) {
              // Explicitly assert that highlightedItem[key] is a string.
              highlightedItem[key] = highlightText(
                highlightedItem[key] as string,
                matchIndex,
                lowerCaseQuery.length,
              ) as unknown as T[keyof T]; // Use a double assertion if necessary.
            }
          }
        });
        return highlightedItem;
      });

    setFilteredData(highlightedData);
  }, [debouncedSearchQuery, data, query, keys]);

  return filteredData;
}

function highlightText(
  text: string,
  startIndex: number,
  length: number,
): string {
  return (
    text.substring(0, startIndex) +
    `<span class="highlight">${text.substring(startIndex, startIndex + length)}</span>` +
    text.substring(startIndex + length)
  );
}

export default useSearchAndHighlight;
