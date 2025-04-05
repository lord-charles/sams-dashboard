"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface SearchResultsProps {
  results: any[]
  selectedIndex: number
  onResultClick: (item: any) => void
}

export function SearchResults({ results, selectedIndex, onResultClick }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-muted-foreground">No results found</p>
      </div>
    )
  }

  return (
    <ScrollArea className="max-h-[300px] overflow-y-auto bg-background">
      <div className="p-1">
        {results.map((result, index) => (
          <div
            key={`${result.id}-${index}`}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer transition-colors",
              selectedIndex === index ? "bg-primary/15 text-primary" : "hover:bg-accent/50",
              result.type === "subitem" && "pl-6",
            )}
            onClick={() => onResultClick(result)}
          >
            {result.icon ? (
              <div
                className={cn(
                  "flex items-center justify-center h-6 w-6 rounded-md",
                  selectedIndex === index ? "bg-primary/20 text-primary" : "text-muted-foreground",
                )}
              >
                <result.icon className="h-4 w-4 shrink-0" />
              </div>
            ) : (
              <div className="w-6" />
            )}
            <div className="flex flex-col">
              <span className={cn("font-medium", selectedIndex === index && "text-primary")}>{result.title}</span>
              {result.parentTitle && <span className="text-xs text-muted-foreground">in {result.parentTitle}</span>}
            </div>
            {result.path && (
              <div className="ml-auto flex items-center gap-1">
                <kbd className="flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">↵</span>
                </kbd>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

