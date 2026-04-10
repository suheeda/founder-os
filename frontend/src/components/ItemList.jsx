import ItemCard from "./ItemCard";

export default function ItemList({ title, items, onStatusChange, onDelete, emptyMsg }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className="section-title">{title}</p>
        <span className="text-xs font-mono text-ink-300">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-ink-300 font-mono py-3 px-4 border border-dashed border-ink-200 rounded-lg">
          {emptyMsg || "Nothing here yet."}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}