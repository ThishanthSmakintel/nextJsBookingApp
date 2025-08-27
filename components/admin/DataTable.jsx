import { Search, Filter } from 'lucide-react'

export default function DataTable({ title, data, columns, searchTerm, onSearch, actions }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">{title}</h2>
          <div className="flex gap-2">
            <div className="form-control">
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="input input-bordered input-sm" 
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                />
                <button className="btn btn-square btn-sm">
                  <Search size={16} />
                </button>
              </div>
            </div>
            {actions}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}